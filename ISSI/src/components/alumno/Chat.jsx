import { useState, useEffect, useRef } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import "./Chat.css"
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";

const AnimatedThinkingDots = () => {
  return (
    <span className="thinking-dots">
      <span className="dot dot-1">.</span>
      <span className="dot dot-2">.</span>
      <span className="dot dot-3">.</span>
    </span>
  )
}

export function ChatbotAsistente() {
  const API = '/api1';

  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const alumnoId = (location && location.state && location.state.alumnoId) || params.id || null

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastMessageId, setLastMessageId] = useState(null)
  const [razonamientoMode, setRazonamientoMode] = useState(0) // NUEVO: Estado para modo razonamiento
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
    if (!alumnoId) return;
    fetch(`${API}/MensajesChat/${alumnoId}`, { credentials: "include" })
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
        setAllMessages([]);
        setMessages([]);
      });
  }, [alumnoId]);

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
      // 1. Guardar la pregunta en BD
      const saveResponse = await fetch(`${API}/GuardarMensajeChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id_usuario: alumnoId,
          pregunta_realizada: combinedText,
          respuesta_obtenida: null,
        }),
      })

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        if (saveResponse.status === 401) {
          throw new Error("Tu sesión ha expirado. Por favor, recarga la página e intenta de nuevo.");
        }
        throw new Error(`HTTP ${saveResponse.status}: ${saveResponse.statusText}`);
      }

      const contentType = saveResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON - ruta no encontrada (404)");
      }

      const savedData = await saveResponse.json()

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

          const startTime = performance.now()
          const response = await fetch(`/llm/generate/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: combinedText,
              id_usuario: alumnoId,
              tipo_usuario: "alumno",
              razonamiento: razonamientoMode, // NUEVO: Enviar modo razonamiento
              history: null,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          generationTime = performance.now() - startTime

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          botResponseText = data.response || "No pude procesar tu solicitud."
          fromCache = data.from_cache || false

          const apiTime = (data.tiempo * 1000).toFixed(0)
          const totalTime = generationTime.toFixed(0)
          const cacheStatus = fromCache ? "(Caché)" : "(Generada)"
        } catch (error) {
          lastError = error
          retries--
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500))
          }
        }
      }

      if (!botResponseText) {
        throw lastError || new Error("No se pudo obtener respuesta después de reintentos")
      }

      // 3. Actualizar el mensaje con la respuesta en BD
      if (savedData.mensaje && savedData.mensaje.id) {
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
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: `Error: ${error.message}. ${
          error.message.includes("expirado") 
            ? "Por favor, recarga la página." 
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

  // Handlers de navegación
  const handleInicio = () => { navigate(`/alumno/${alumnoId}`) }
  const handleIns = () => { navigate(`/alumno/inscripcion/${alumnoId}`) }
  const handleHorarios = () => { navigate(`/alumno/horarios/${alumnoId}`) }
  const handleKardex = () => { navigate("/alumno/Kardex") }
  const handleEditPer = () => { navigate(`/alumno/editarDatos/${alumnoId}`) }
  const handleLogout = () => { navigate("/") }

  return (
    <div className="chatbot-container">
      <SidebarAlumno />

      {/* Main Content */}
      <main className="main-content">
        <header className="chat-header">
          <h1>Asistente de Chat de IA</h1>
          {alumnoId && <div style={{ fontSize: 12, color: "#666" }}>Alumno: {alumnoId}</div>}
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
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
                {message.text}
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