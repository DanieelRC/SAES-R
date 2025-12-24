import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Profesor.css";
import { ClasesImpartidas } from "./ClasesImpartidas";
import { ProfeSideBar } from "./ProfeSidebar";
import { VerAvisos } from "../shared/VerAvisos";
import CambiarContraseña from "../formulario/RecuperarContra";

export function Profesor() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isClases = location.pathname.endsWith("/clases");
  const API = "/api1";

  const [cursos, setCursos] = useState([]);
  const [profesor, setProfesor] = useState(null);
  const [primera_vez, setPrimeraVez] = useState(null);

  useEffect(() => {
    fetch(`${API}/PrimeraVez/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setPrimeraVez(data.primera_vez);
      })
      .catch(() => setPrimeraVez(null));
  }, [id]);

  // Carga datos del dashboard (no en /clases)
  useEffect(() => {
    if (isClases) return;
    (async () => {
      try {
        const r = await fetch(`${API}/ObtenerCursos/Prof/${id}`, { credentials: "include" });
        const j = await r.json();
        const base = Array.isArray(j?.cursos) ? j.cursos : [];

        const conDist = await Promise.all(
          base.map(async (c) => {
            try {
              const rr = await fetch(`${API}/ObtenerDist/${c.id}`, { credentials: "include" });
              const dd = await rr.json();
              c.Distribucion = Array.isArray(dd?.Distri) ? dd.Distri : [];
            } catch {
              c.Distribucion = [];
            }
            return c;
          })
        );
        setCursos(conDist);
      } catch {
        setCursos([]);
      }
    })();
  }, [id, isClases]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/ObtenerProfesor/${id}`, {
          credentials: "include",
        });
        const j = await r.json();
        setProfesor(j.profesor || null);
      } catch (err) {
        console.error("Error al obtener datos del profesor:", err);
        setProfesor(null);
      }
    })();
  }, [id]);

  const totalGrupos = cursos.length;
  const clasesHoy = useMemo(() => {
    const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    const hoy = dias[new Date().getDay()];
    return cursos.reduce((acc, c) => {
      const d = Array.isArray(c?.Distribucion) ? c.Distribucion : [];
      const n = d.filter(x => x?.dia === hoy || (hoy === "Miércoles" && x?.dia === "Miércoles")).length;
      return acc + n;
    }, 0);
  }, [cursos]);

  const recientes = useMemo(() => cursos.slice(0, 5), [cursos]);

  // Render condicionado por primera_vez: null = cargando, true = mensaje, false = UI completa
  return (
    <div className="admin-container">
      {primera_vez === true ? (
        <main className="centrar">
          <CambiarContraseña />
        </main>
      ) : (
        <>
          <ProfeSideBar />

          {/* Main */}
          <main className="main-content">
            {!isClases ? (
              <>
                <header className="chat-header">
                  <div className="encabezado-section">
                    <div>
                      <h1>
                        {profesor 
                          ? `¡Bienvenido(a), ${profesor.nombre} ${profesor.ape_paterno}!`
                          : "Cargando..."}
                      </h1>
                    </div>
                  </div>
                  <img className="escom-logo" src="/escom.png" alt="ESCOM" />
                </header>

                <section className="kpi-row">
                  <div className="kpi-card">
                    <p className="kpi-title">Total de grupos asignados</p>
                    <div className="kpi-value">{totalGrupos}</div>
                  </div>
                  <div className="kpi-card">
                    <p className="kpi-title">Clases programadas para hoy</p>
                    <div className="kpi-value">{clasesHoy}</div>
                  </div>
                </section>

                <section className="section-card">
                  <h3>Grupos vistos recientemente</h3>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Materia</th>
                          <th>Grupo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recientes.length === 0 ? (
                          <tr><td colSpan={3} className="empty">Sin cursos</td></tr>
                        ) : recientes.map(c => {
                          const materia = c?.Unidad_Aprendizaje?.nombre ?? "—";
                          const grupo = c?.nombre ?? "—";
                          const inscritos = Number(c?.inscritos_count ?? c?.inscritos?.length ?? 0);
                          return (
                            <tr key={c.id}>
                              <td>{materia}</td>
                              <td className="muted">{grupo}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <ClasesImpartidas profesorId={id} />
            )}

            <section className="avisos-section">
              <VerAvisos objetivo="Profesores" />
            </section>
          </main>
        </>
      )}
    </div>
  );
}