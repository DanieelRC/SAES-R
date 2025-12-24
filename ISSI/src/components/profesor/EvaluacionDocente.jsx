import React, { useEffect, useState } from "react";
import "./EvaluacionDocente.css";
import { ProfeSideBar } from "./ProfeSidebar";
const API = "/api1";

export default function EvaluacionDocente({ profesorId: propProfesorId }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const profesorId = propProfesorId || localStorage.getItem("profesorId") || null;

  useEffect(() => {
    let cancelled = false;

    async function fetchEvaluaciones() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/profesor/${profesorId}/evaluaciones`, { credentials: "include" });
        if (!res.ok) throw new Error("no data");
        const data = await res.json();
        // Esperamos { success: true, evaluaciones: [...] }
        if (!cancelled) {
          if (data && data.success && Array.isArray(data.evaluaciones)) {
            setEvaluaciones(data.evaluaciones);
          } else if (Array.isArray(data)) {
            // compatibilidad con respuestas antiguas
            setEvaluaciones(data);
          } else {
            setEvaluaciones([]);
          }
        }
      } catch (e) {
        if (!cancelled) setEvaluaciones([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (profesorId) fetchEvaluaciones();
    else {
      setEvaluaciones([]);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [profesorId]);

  const promedio = (
    evaluaciones.reduce((s, r) => s + (Number(r.estrellas) || 0), 0) / (evaluaciones.length || 1)
  ).toFixed(2);

  return (
    <div className="admin-container">
      <ProfeSideBar />

      <main className="profesor-main">
        <div className="profesor-main-inner">
          <header className="chat-header">
          <div className="encabezado-section">
            <h1>Evaluaciones del Profesor</h1>
          </div>
            
            <div className="prof-page-header-right">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>Promedio</div>
                <div style={{ color: "var(--prof-guinda)", fontWeight: 800, fontSize: "2rem" }}>{loading ? "—" : promedio}</div>
              </div>
              <div style={{ fontWeight: 600, color: "#444" }}>{loading ? "—" : `${evaluaciones.length} reseñas`}</div>
            </div>
            <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
          </header>

          {loading && <div className="loading">Cargando evaluaciones...</div>}

          {!loading && evaluaciones.length === 0 && (
            <div className="empty">Aún no hay evaluaciones para este profesor.</div>
          )}

          <div className="cards-grid">
            {evaluaciones.map((r) => (
              <article key={r.id} className="section-card eval-card">
                <div className="star-badge" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < r.estrellas ? "star filled" : "star"}>★</span>
                  ))}
                </div>

                <div className="comentario">{r.comentario}</div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
