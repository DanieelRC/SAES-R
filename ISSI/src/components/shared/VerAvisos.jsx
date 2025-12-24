import React, { useEffect, useState, useCallback } from "react";
import "./VerAvisos.css";

export function VerAvisos({ objetivo }) {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = "/api1";

  const cargarAvisos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API}/api/avisos/por-objetivo/${objetivo}`,
        { credentials: 'include' } // Enviar cookies de sesión
      );
      const data = await response.json();

      if (data.success) {
        setAvisos(data.avisos);
      }
    } catch (error) {
      console.error("Error al cargar avisos:", error);
    } finally {
      setLoading(false);
    }
  }, [objetivo]);

  useEffect(() => {
    cargarAvisos();
  }, [cargarAvisos]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="avisos-loading">
        <div className="spinner"></div>
        <p>Cargando avisos...</p>
      </div>
    );
  }

  return (
    <div className="avisos-container">
      <h2>Avisos y Noticias</h2>
      
      {avisos.length === 0 ? (
        <div className="no-avisos">
          <p>No hay avisos disponibles en este momento</p>
        </div>
      ) : (
        <div className="avisos-grid">
          {avisos.map((aviso) => (
            <div key={aviso.id} className="aviso-card">
              <div className="aviso-header">
                <h3>{aviso.titulo}</h3>
                <span className="aviso-badge">
                  {aviso.objetivo === "todos"
                    ? "General"
                    : aviso.objetivo === "alumno"
                    ? "Estudiantes"
                    : "Profesores"}
                </span>
              </div>

              {aviso.imagen && (
                <div className="aviso-imagen">
                  <img src={aviso.imagen} alt={aviso.titulo} />
                </div>
              )}

              <div className="aviso-body">
                <p>{aviso.descripcion}</p>
              </div>

              <div className="aviso-footer">
                <small>
                  Vigente hasta: {formatearFecha(aviso.fecha_vencimiento)}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
