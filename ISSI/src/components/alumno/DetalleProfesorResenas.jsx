import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { reviewsApi } from "./reviewsApi";
import "./ResenarProfesores.css";
import { SidebarAlumno } from "./SideBarAlumno";

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

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function Pill({ children }) {
  return <span className="rp-chip">{children}</span>;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "";
  }
}

export default function DetalleProfesorResenas() {
  const { id } = useParams();
  const q = useQuery();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [profesor, setProfesor] = useState(null);
  const [resumen, setResumen] = useState(null);

  const [sort, setSort] = useState("recent"); // recent|best
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [data, setData] = useState({ resenas: [], totalPages: 1, total: 0 });
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    rating: 5,
    dificultad: 3,
    recomienda: true,
    anonimo: true,
    curso: "",
    semestre: "",
    comentario: "",
  });

  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  const abrirNueva = q.get("nueva") === "1";

  // Cargar resumen + primera página
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const r1 = await reviewsApi.resumenProfesor(id);
        const r2 = await reviewsApi.resenasProfesor(id, { page: 1, limit, sort });
        if (!alive) return;
        setProfesor(r1.profesor);
        setResumen(r1.resumen);
        setData({ resenas: r2.resenas || [], totalPages: r2.totalPages || 1, total: r2.total || 0 });
        setPage(1);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "No se pudo cargar");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [id, sort, limit]);

  async function loadMore() {
    if (loadingMore) return;
    const next = page + 1;
    if (next > data.totalPages) return;
    setLoadingMore(true);
    try {
      const r = await reviewsApi.resenasProfesor(id, { page: next, limit, sort });
      setData((prev) => ({
        ...prev,
        resenas: [...prev.resenas, ...(r.resenas || [])],
        totalPages: r.totalPages || prev.totalPages,
        total: r.total || prev.total,
      }));
      setPage(next);
    } catch (e) {
      setToast(e.message || "No se pudo cargar más");
      setTimeout(() => setToast(""), 2200);
    } finally {
      setLoadingMore(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setSending(true);
    setToast("");
    try {
      const payload = {
        rating: Number(form.rating),
        dificultad: Number(form.dificultad),
        recomienda: Boolean(form.recomienda),
        anonimo: Boolean(form.anonimo),
        curso: form.curso?.trim() || null,
        semestre: form.semestre?.trim() || null,
        comentario: form.comentario?.trim(),
      };

      if (!payload.comentario || payload.comentario.length < 10) {
        throw new Error("El comentario debe tener al menos 10 caracteres.");
      }

      await reviewsApi.crearResena(id, payload);
      setToast("✅ Reseña enviada a revisión.");
      setTimeout(() => setToast(""), 2500);

      setForm((f) => ({ ...f, comentario: "" }));
    } catch (e2) {
      setToast(`⚠️ ${e2.message || "No se pudo enviar"}`);
      setTimeout(() => setToast(""), 2600);
    } finally {
      setSending(false);
    }
  }

  async function toggleUtil(reviewId, currentlyVoted) {
    try {
      await reviewsApi.votarUtil(reviewId, currentlyVoted ? 0 : 1);
      // Optimista: no conocemos el score exacto aquí; recargamos solo esa página “suave”
      const r = await reviewsApi.resenasProfesor(id, { page: 1, limit: page * limit, sort });
      setData((prev) => ({ ...prev, resenas: r.resenas || prev.resenas }));
    } catch (e) {
      setToast(e.message || "No se pudo votar");
      setTimeout(() => setToast(""), 2200);
    }
  }

  const avgRating = Number(resumen?.avgRating || 0);
  const avgDif = Number(resumen?.avgDificultad || 0);
  const numResenas = Number(resumen?.numResenas || 0);
  const numRecom = Number(resumen?.numRecomienda || 0);
  const pctRecom = numResenas ? Math.round((numRecom / numResenas) * 100) : 0;

  return (
    <div className="alumno-container">
      <section> 
      {/* <AlumnoSidebar /> */}
      <SidebarAlumno />
      <main className="main-content">
        {toast && <div className="rp-toast">{toast}</div>}

        <header className="chat-header">
          <div className="encabezado-section">
            <h1>{profesor?.nombre || "Profesor"}</h1>
            <p>Reseñas y calificaciones</p>
          </div>
          <a href="#nueva-resena" className={`rp-btn primary ${abrirNueva ? "pulse" : ""}`}>
              Escribir reseña
            </a>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>
        <section className="gestion-alumnos"> 
          <div className="inscripcion-container">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rp-select">
              <option value="recent">Más recientes</option>
              <option value="best">Más útiles</option>
            </select>
            
          </div>
        

        {err && <div className="rp-alert">⚠️ {err}</div>}

        {loading ? (
          <section className="rp-summary skeleton">
            <div className="sk-title" />
            <div className="sk-line" />
            <div className="sk-line short" />
          </section>
        ) : (
          <section className="rp-summary">
            <div className="rp-summary-card">
              <span className="k">Promedio</span>
              <Stars value={avgRating} />
              <div className="rp-mini">
                <span className="muted">{numResenas} reseña{numResenas === 1 ? "" : "s"}</span>
              </div>
            </div>

            <div className="rp-summary-card">
              <span className="k">Dificultad</span>
              <div className="rp-big">{avgDif ? avgDif.toFixed(1) : "—"} / 5</div>
              <div className="rp-mini">
                <span className="muted">Promedio general</span>
              </div>
            </div>

            <div className="rp-summary-card">
              <span className="k">Recomendación</span>
              <div className="rp-big">{pctRecom}%</div>
              <div className="rp-mini">
                <span className="muted">{numRecom} lo recomiendan</span>
              </div>
            </div>
          </section>
        )}

        <section className="rp-two">
          <div className="rp-col">
            <h2 className="rp-section-title">Reseñas</h2>

            {data.resenas.length === 0 && !loading ? (
              <div className="rp-empty">
                <h3>Aún no hay reseñas aprobadas</h3>
                <p>¡Sé el primero en escribir una!</p>
              </div>
            ) : (
              <div className="rp-reviews">
                {data.resenas.map((r) => {
                  const userName = r.alumno?.nombre || "Anónimo";
                  const scoreUtil = Number(r.scoreUtil || 0);

                  // Si tu backend NO devuelve si ya votaste, lo dejamos “simple”: botón solo marca.
                  // Puedes agregarlo luego como r.userVoted.
                  const userVoted = Boolean(r.userVoted);

                  return (
                    <article key={r.id} className="rp-review">
                      <div className="rp-review-top">
                        <div className="rp-review-who">
                          <div className="avatar">{userName.slice(0, 1).toUpperCase()}</div>
                          <div>
                            <div className="name">{userName}</div>
                            <div className="meta">{formatDate(r.createdAt)}</div>
                          </div>
                        </div>

                        <div className="rp-review-stars">
                          <Stars value={r.rating} />
                          <div className="rp-dif">Dificultad: <b>{Number(r.dificultad || 0)}</b>/5</div>
                        </div>
                      </div>

                      <div className="rp-review-tags">
                        {r.curso ? <Pill>📘 {r.curso}</Pill> : null}
                        {r.semestre ? <Pill>📅 {r.semestre}</Pill> : null}
                        <Pill>{r.recomienda ? "✅ Lo recomienda" : "⚠️ No lo recomienda"}</Pill>
                      </div>

                      <p className="rp-review-text">{r.comentario}</p>

                      <div className="rp-review-footer">
                        <button
                          className={`rp-btn ${userVoted ? "ghost active" : "ghost"}`}
                          onClick={() => toggleUtil(r.id, userVoted)}
                          title="Marcar como útil"
                        >
                          👍 Útil <span className="rp-count">{scoreUtil}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {page < data.totalPages && (
              <div className="rp-more">
                <button className="rp-btn" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? "Cargando…" : "Cargar más"}
                </button>
              </div>
            )}
          </div>

          <aside className="rp-col">
            <h2 className="rp-section-title" id="nueva-resena">Escribir reseña</h2>

            <form className="rp-form" onSubmit={submitReview}>
              <div className="rp-form-row">
                <label>
                  Calificación (1-5)
                  <select
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  >
                    {[5, 4, 3, 2, 1].map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Dificultad (1-5)
                  <select
                    value={form.dificultad}
                    onChange={(e) => setForm((f) => ({ ...f, dificultad: Number(e.target.value) }))}
                  >
                    {[5, 4, 3, 2, 1].map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rp-form-row">
                <label>
                  Materia (opcional)
                  <input
                    value={form.curso}
                    onChange={(e) => setForm((f) => ({ ...f, curso: e.target.value }))}
                    placeholder="Ej. Redes Neuronales"
                  />
                </label>

                <label>
                  Semestre (opcional)
                  <input
                    value={form.semestre}
                    onChange={(e) => setForm((f) => ({ ...f, semestre: e.target.value }))}
                    placeholder="Ej. 2025-1"
                  />
                </label>
              </div>

              <div className="rp-form-row toggles">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={form.recomienda}
                    onChange={(e) => setForm((f) => ({ ...f, recomienda: e.target.checked }))}
                  />
                  Recomiendo al profesor
                </label>

                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={form.anonimo}
                    onChange={(e) => setForm((f) => ({ ...f, anonimo: e.target.checked }))}
                  />
                  Publicar como anónimo
                </label>
              </div>

              <label>
                Comentario (mín. 10 caracteres)
                <textarea
                  value={form.comentario}
                  onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
                  placeholder="Describe tu experiencia (claro, respetuoso y con contexto)."
                  rows={7}
                />
              </label>

              <button className="rp-btn primary" type="submit" disabled={sending}>
                {sending ? "Enviando…" : "Enviar reseña"}
              </button>

              <p className="rp-form-hint">
                Tu reseña se envía a revisión antes de publicarse.
              </p>
            </form>
          </aside>
        </section>
        </section>
      </main>
      </section>
    </div>
  );
}
