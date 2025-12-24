"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation, useParams, useNavigate, Link } from "react-router-dom"
import "./Chat.css"
import { ProfeSideBar } from "./ProfeSidebar"

const AnimatedThinkingDots = () => {
  return (
    <span className="thinking-dots">
      <span className="dot dot-1">.</span>
      <span className="dot dot-2">.</span>
      <span className="dot dot-3">.</span>
    </span>
  )
}

export function ChatbotProfesor() {
  const API = '/api1';
  const { id } = useParams();
  const location = useLocation()
  const navigate = useNavigate()
  
  // NUEVO: Obtener tipo_usuario del state o usar "profesor" por defecto
  const tipoUsuario = location.state?.tipo_usuario || "profesor"
  const profesorId = id || location.state?.profesorId || null

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [razonamientoMode, setRazonamientoMode] = useState(0) // NUEVO: Estado para modo razonamiento
  const [lastMessageId, setLastMessageId] = useState(null)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [allMessages, setAllMessages] = useState([])
  const [displayedCount, setDisplayedCount] = useState(20)
  const [showLoadMore, setShowLoadMore] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showScrollTopButton, setShowScrollTopButton] = useState(false)
  const debounceTimerRef = useRef(null)
  const pendingMessagesRef = useRef([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [isLoading])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    setShowLoadMore(scrollTop === 0 && allMessages.length > displayedCount)
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    setShowScrollTopButton(scrollTop > 100)
  }

  const handleLoadMore = () => {
    const newCount = Math.min(displayedCount + 10, allMessages.length)
    setDisplayedCount(newCount)
  }

  useEffect(() => {
    if (!profesorId) return;
    fetch(`${API}/MensajesChat/${profesorId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON - likely 404 page");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.messages) {
          setAllMessages([]);
          setMessages([]);
          return;
        }
        const raw = Array.isArray(data.messages) ? data.messages : [];
        const loaded = [];
        raw.forEach((m) => {
          loaded.push({
            id: `${m.id}-q`,
            text: m.pregunta_realizada,
            sender: "user",
            time: new Date(m.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true }),
          });
          if (m.respuesta_obtenida) {
            loaded.push({
              id: `${m.id}-a`,
              text: m.respuesta_obtenida,
              sender: "bot",
              time: new Date(m.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true }),
            });
          }
        });
        setAllMessages(loaded);
        setMessages(loaded.slice(-20));
        setDisplayedCount(20);
        setTimeout(() => scrollToBottom(), 100)
      })
      .catch((err) => {
        console.error("Error cargando mensajes:", err);
        setAllMessages([]);
        setMessages([]);
      });
  }, [profesorId]);

  useEffect(() => {
    if (allMessages.length > 0) {
      setMessages(allMessages.slice(-displayedCount));
    }
  }, [displayedCount, allMessages]);

  const sendCombinedMessage = async () => {
    if (pendingMessagesRef.current.length === 0) return

    const messagesToSend = [...pendingMessagesRef.current]
    pendingMessagesRef.current = []

    const combinedText = messagesToSend
      .map((msg) => msg.text)
      .join("\n")

    setIsLoading(true)

    try {
      console.log("=== DEBUG: Iniciando guardado de mensaje ===");
      console.log("Profesor ID:", profesorId);
      console.log("Tipo Usuario:", tipoUsuario);
      console.log("Modo Razonamiento:", razonamientoMode); // NUEVO: Log del modo

      // 1. Guardar la pregunta en BD
      const saveResponse = await fetch(`${API}/GuardarMensajeChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id_usuario: profesorId,
          pregunta_realizada: combinedText,
          respuesta_obtenida: null,
        }),
      })

      console.log("=== DEBUG: Respuesta del servidor ===");
      console.log("Status:", saveResponse.status);
      console.log("Status Text:", saveResponse.statusText);

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error("=== DEBUG: Error del servidor ===");
        console.error("Error text:", errorText);
        
        if (saveResponse.status === 401) {
          throw new Error("Tu sesión ha expirado. Por favor, recarga la página e intenta de nuevo.");
        }
        if (saveResponse.status === 403) {
          throw new Error("No tienes permisos para guardar mensajes. Verifica tu sesión como profesor.");
        }
        throw new Error(`HTTP ${saveResponse.status}: ${saveResponse.statusText}`);
      }

      const contentType = saveResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("=== DEBUG: Respuesta no es JSON ===");
        console.error("Content-Type:", contentType);
        throw new Error("Response is not JSON - ruta no encontrada (404)");
      }

      const savedData = await saveResponse.json()
      console.log("=== DEBUG: Datos guardados ===");
      console.log("Saved data:", savedData);

      if (!savedData.success) {
        throw new Error(savedData.error || "Error al guardar la pregunta")
      }

      setLastMessageId(savedData.mensaje.id)

      // 2. Obtener respuesta del bot con reintentos y timeout
      let botResponseText = null
      let retries = 2
      let lastError = null
      let generationTime = 0
      let fromCache = false

      while (retries > 0 && !botResponseText) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 150000)

          console.log("=== DEBUG: Llamando a FastAPI ===");
          console.log("URL: /llm/generate/");
          console.log("Body:", {
            query: combinedText.substring(0, 50) + "...",
            id_usuario: profesorId,
            tipo_usuario: tipoUsuario,
            razonamiento: razonamientoMode // NUEVO: Log del modo
          });

          const startTime = performance.now()
          const response = await fetch(`/llm/generate/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
              query: combinedText,
              id_usuario: profesorId,
              tipo_usuario: tipoUsuario,
              razonamiento: razonamientoMode, // NUEVO: Enviar modo razonamiento
              history: null,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          generationTime = performance.now() - startTime

          console.log("=== DEBUG: Respuesta de FastAPI ===");
          console.log("Status:", response.status);
          console.log("Status Text:", response.statusText);

          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("El servidor de IA rechazó la petición. Verifica la configuración de CORS.");
            }
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log("=== DEBUG: Datos de FastAPI ===");
          console.log("Response:", data);
          
          botResponseText = data.response || "No pude procesar tu solicitud."
          fromCache = data.from_cache || false

        } catch (error) {
          console.error("=== DEBUG: Error en FastAPI ===");
          console.error("Error:", error);
          lastError = error
          retries--
          if (retries > 0) {
            console.log(`Reintentando... (${retries} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, 1500))
          }
        }
      }

      if (!botResponseText) {
        throw lastError || new Error("No se pudo obtener respuesta después de reintentos")
      }

      // 3. Actualizar el mensaje con la respuesta en BD
      if (savedData.mensaje && savedData.mensaje.id) {
        console.log("=== DEBUG: Actualizando mensaje en BD ===");
        console.log("Mensaje ID:", savedData.mensaje.id);
        
        await fetch(`${API}/ActualizarMensajeChat/${savedData.mensaje.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            respuesta_obtenida: botResponseText,
          }),
        }).catch(err => console.error("Error actualizando respuesta:", err))
      }

      const botResponse = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: "bot",
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true }),
      }

      setAllMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("=== DEBUG: Error final ===");
      console.error("Error completo:", error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: `Error: ${error.message}. ${
          error.message.includes("expirado") 
            ? "Por favor, recarga la página." 
            : error.message.includes("permisos")
            ? "Problema de permisos. Contacta al administrador."
            : "Intenta de nuevo o verifica tu conexión."
        }`,
        sender: "bot",
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true }),
      }
      setAllMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      debounceTimerRef.current = null
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    const userMessageText = inputMessage
    setInputMessage("")

    const newMessage = {
      id: `temp-${Date.now()}`,
      text: userMessageText,
      sender: "user",
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true }),
    }

    setAllMessages((prev) => [...prev, newMessage])
    pendingMessagesRef.current.push({
      text: userMessageText,
    })

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      sendCombinedMessage()
    }, 5000)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage()
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="admin-container">
      <ProfeSideBar />

      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
          <h1>Asistente de Chat de IA</h1>
          </div>
          {profesorId && (
            <div style={{ fontSize: 12, color: "#666" }}>
              Profesor: {profesorId} | Tipo: {tipoUsuario}
            </div>
          )}
          <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
        </header>

        <div className="chat-messages" ref={messagesContainerRef} onScroll={handleScroll}>
          {showLoadMore && (
            <button className="load-more-button" onClick={handleLoadMore}>
              Cargar más mensajes
            </button>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === "user" ? "message-user" : "message-bot"}`}>
              <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message message-bot">
              <div className="message-content">
                <p>
                  Pensando<AnimatedThinkingDots />
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showScrollTopButton && (
          <button className="scroll-to-top-button" onClick={scrollToTop} title="Ir al mensaje más antiguo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 19V5M12 5L5 12M12 5L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {showScrollButton && (
          <button className="scroll-to-bottom-button" onClick={scrollToBottom} title="Ir al último mensaje">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Escribe tu mensaje aquí..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          {/* NUEVO: Toggle button para modo razonamiento */}
          <div className="reasoning-toggle-container">
            <span className="reasoning-label">Modo de razonamiento avanzado</span>
            <label className="reasoning-toggle" title={razonamientoMode === 1 ? "Modo Razonamiento Activo" : "Modo Razonamiento Inactivo"}>
              <input
                type="checkbox"
                checked={razonamientoMode === 1}
                onChange={(e) => setRazonamientoMode(e.target.checked ? 1 : 0)}
                disabled={isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <button className="send-button" onClick={handleSendMessage} disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </main>
    </div>
  )
}
