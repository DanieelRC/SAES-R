import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PublicarNoticia.css";
import { AdminSidebar } from "../admin/AdminSidebar.jsx";

export function PublicarNoticia() {
  const navigate = useNavigate();
  const API = "/api1";

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    objetivo: "todos",
    fecha_vencimiento: "",
  });
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMensaje({
          tipo: "error",
          texto: "La imagen no debe superar los 5MB",
        });
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setMensaje({
          tipo: "error",
          texto: "Solo se permiten archivos de imagen",
        });
        return;
      }

      setImagen(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      // Validaciones
      if (
        !formData.titulo ||
        !formData.descripcion ||
        !formData.fecha_vencimiento
      ) {
        setMensaje({
          tipo: "error",
          texto: "Por favor completa todos los campos obligatorios",
        });
        setLoading(false);
        return;
      }

      // Validar fecha de vencimiento
      const fechaVencimiento = new Date(formData.fecha_vencimiento);
      const fechaActual = new Date();
      if (fechaVencimiento <= fechaActual) {
        setMensaje({
          tipo: "error",
          texto: "La fecha de vencimiento debe ser posterior a la fecha actual",
        });
        setLoading(false);
        return;
      }

      // Crear FormData para enviar la imagen
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("objetivo", formData.objetivo);
      formDataToSend.append("fecha_vencimiento", formData.fecha_vencimiento);
      if (imagen) {
        formDataToSend.append("imagen", imagen);
      }

      const response = await fetch(`${API}/api/avisos/crear`, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setMensaje({
          tipo: "success",
          texto: "¡Noticia publicada exitosamente!",
        });

        // Limpiar formulario
        setFormData({
          titulo: "",
          descripcion: "",
          objetivo: "todos",
          fecha_vencimiento: "",
        });
        setImagen(null);
        setPreviewImagen(null);

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/administrador");
        }, 2000);
      } else {
        setMensaje({
          tipo: "error",
          texto: data.message || "Error al publicar la noticia",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate("/administrador");
  };

  return (
    <div className="admin-container">
      {/* Menú lateral fijo */}
      <AdminSidebar />

      {/* Contenido principal con el mismo layout que Administrador */}
      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <div> 
            <h1>Publicar Noticia</h1>
            </div>
            
          </div>
          <div> 
            <p className="subtitulo-carreras">
              Sube una noticia dirigida a la comunidad politécnica.
            </p>
            </div>
          <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
        </header>

        <section className="publicar-noticia-section">
          <div className="publicar-noticia-card">
            {mensaje.texto && (
              <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            <form onSubmit={handleSubmit} className="form-noticia">
              <div className="form-group">
                <label htmlFor="titulo">
                  Título <span className="requerido">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ingrese el título de la noticia"
                  maxLength="200"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">
                  Descripción/Comentario <span className="requerido">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Ingrese la descripción o comentario de la noticia"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagen">Imagen (opcional)</label>
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImagenChange}
                />
                <small>Tamaño máximo: 5MB. Formatos: JPG, PNG, GIF</small>

                {previewImagen && (
                  <div className="preview-imagen">
                    <img src={previewImagen} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagen(null);
                        setPreviewImagen(null);
                      }}
                      className="btn-eliminar-preview"
                    >
                      ✕ Eliminar imagen
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="objetivo">
                  Dirigido a <span className="requerido">*</span>
                </label>
                <select
                  id="objetivo"
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="todos">
                    Todos (Profesores y Alumnos)
                  </option>
                  <option value="profesor">Solo Profesores</option>
                  <option value="alumno">Solo Alumnos</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fecha_vencimiento">
                  Fecha de vencimiento <span className="requerido">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="fecha_vencimiento"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento}
                  onChange={handleInputChange}
                  required
                />
                <small>
                  La noticia dejará de mostrarse después de esta fecha
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="btn blanco"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn azul"
                  disabled={loading}
                >
                  {loading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
