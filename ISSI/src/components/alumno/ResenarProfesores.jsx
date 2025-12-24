import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reviewsApi } from "./reviewsApi";
import "./ResenarProfesores.css";
import { SidebarAlumno } from "./SideBarAlumno";

// Si ya tienes tu sidebar, úsalo:
// import { AlumnoSidebar } from "../../components/alumno/AlumnoSidebar";

function Stars({ value = 0 }) {
  const v = Number(value || 0);
  const full = Math.round(v * 10) / 10;
  const filled = Math.round(full);
  return (
    <div className="rp-stars" title={`${full.toFixed(1)} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? "on" : ""}>★</span>
      ))}
      <span className="rp-stars-num">{full ? full.toFixed(1) : "—"}</span>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  return <span className={`rp-badge ${tone}`}>{children}</span>;
}

export default function ResenarProfesores() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profes, setProfes] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("mejor"); // mejor|peor|mas_resenas|a_z
  const [minRating, setMinRating] = useState(0);

  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await reviewsApi.listarProfes({ search, sort });
        if (!alive) return;
        setProfes(res.profesores || []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "No se pudo cargar");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [search, sort]);

  const visible = useMemo(() => {
    return (profes || []).filter((p) => {
      const avg = Number(p.avgRating || 0);
      return avg >= Number(minRating || 0);
    });
  }, [profes, minRating]);

  return (
    <div className="rp-shell">
      {/* <AlumnoSidebar /> */}
      <SidebarAlumno />
      <main className="rp-main">
        <header className="rp-header">
          <div>
            <h1>Reseñar Profesores</h1>
            <p>Busca, compara y deja tu reseña (tipo misprofesores).</p>
          </div>

          <div className="rp-controls">
            <div className="rp-input">
              <span className="rp-input-ico">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre…"
              />
            </div>

            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rp-select">
              <option value="mejor">Mejor calificados</option>
              <option value="peor">Peor calificados</option>
              <option value="mas_resenas">Más reseñas</option>
              <option value="a_z">A - Z</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="rp-select"
              title="Filtro por calificación mínima"
            >
              <option value={0}>Todas</option>
              <option value={1}>1+ estrellas</option>
              <option value={2}>2+ estrellas</option>
              <option value={3}>3+ estrellas</option>
              <option value={4}>4+ estrellas</option>
            </select>
          </div>
        </header>

        {err && <div className="rp-alert">⚠️ {err}</div>}

        {loading ? (
          <div className="rp-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rp-card skeleton">
                <div className="sk-title" />
                <div className="sk-line" />
                <div className="sk-line short" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rp-grid">
            {visible.length === 0 ? (
              <div className="rp-empty">
                <h3>No hay resultados</h3>
                <p>Prueba con otro nombre o baja el filtro.</p>
              </div>
            ) : (
              visible.map((p) => {
                const avg = Number(p.avgRating || 0);
                const diff = Number(p.avgDificultad || 0);
                const n = Number(p.numResenas || 0);

                return (
                  <article
                    key={p.id}
                    className="rp-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/alumno/resenas-profesor/${p.id}`)}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/alumno/resenas-profesor/${p.id}`)}
                  >
                    <div className="rp-card-top">
                      <h3 className="rp-prof-name">{p.nombre || "Profesor"}</h3>
                      <Badge tone={n >= 10 ? "good" : "neutral"}>{n} reseña{n === 1 ? "" : "s"}</Badge>
                    </div>

                    <div className="rp-metrics">
                      <div className="rp-metric">
                        <span className="label">Calificación</span>
                        <Stars value={avg} />
                      </div>
                      <div className="rp-metric">
                        <span className="label">Dificultad</span>
                        <div className="rp-pill">
                          <span className="dot" />
                          {diff ? diff.toFixed(1) : "—"} / 5
                        </div>
                      </div>
                    </div>

                    <div className="rp-card-actions">
                      <button
                        className="rp-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/alumno/resenas-profesor/${p.id}`);
                        }}
                      >
                        Ver reseñas
                      </button>
                      <button
                        className="rp-btn primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/alumno/resenas-profesor/${p.id}?nueva=1`);
                        }}
                      >
                        Reseñar
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        <footer className="rp-footer">
          <span className="rp-tip">
            Tip: Sé respetuoso, describe contexto (materia/semestre) y evita datos personales.
          </span>
        </footer>
      </main>
    </div>
  );
}
