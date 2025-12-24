import React, { useEffect, useState } from "react";
import "./ConsultarCalificaciones.css";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";

export function ConsultarCalificaciones() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const API = "/api1";

  useEffect(() => {
    fetch(`${API}/ConsultarCalificaciones`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDatos(data.calificaciones || []);
        } else {
          setError("No se pudieron obtener las calificaciones.");
        }
      })
      .catch((err) => {
        console.error("Error al obtener las calificaciones guardadas", err);
        setError("Ocurrió un error al cargar las calificaciones.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <div className="alumno-container">
          <SidebarAlumno />
    
          {/* =============== CONTENIDO PRINCIPAL =============== */}
          <main className="main-content">
            <header className="chat-header">
              <div className ="encabezado-section">
                <h1>Consultar Calificaciones</h1>
                
                </div>
                <p className="consultar-calificaciones-subtitle">
            Revisa las calificaciones registradas por periodo y extraordinario.
          </p>
              
              <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
    
            </header>
    <section className="consultar-calificaciones-page">
      <div className="consultar-calificaciones-card">
       

        {cargando && (
          <div className="consultar-calificaciones-estado">
            Cargando calificaciones...
          </div>
        )}

        {error && !cargando && (
          <div className="consultar-calificaciones-estado consultar-calificaciones-error">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="consultar-calificaciones-table-wrapper">
            <table className="consultar-calificaciones-table">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Materia</th>
                  <th>Profesor</th>
                  <th>1er periodo</th>
                  <th>2do periodo</th>
                  <th>3er periodo</th>
                  <th>Calificación final</th>
                  <th>Extraordinario</th>
                </tr>
              </thead>

              <tbody>
                {datos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="consultar-calificaciones-empty"
                    >
                      No hay calificaciones registradas.
                    </td>
                  </tr>
                ) : (
                  datos.map((dato, idx) => (
                    <tr key={idx}>
                      <td>{dato.id_grupo}</td>
                      <td>{dato.nombre_ua}</td>
                      <td>{dato.profesor}</td>
                      <td>{dato.calificacion_primer ?? "-"}</td>
                      <td>{dato.calificacion_segundo ?? "-"}</td>
                      <td>{dato.calificacion_tercer ?? "-"}</td>
                      <td>{dato.calificacion_final ?? "-"}</td>
                      <td>{dato.extra ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
    </main>
    </div>
  );
}
