import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";
import "./HistorialAcademico.css";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function HistorialAcademico() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [historial, setHistorial] = useState([]);
  const [semestres, setSemestres] = useState([]);

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    fetch("/api1/ObtenerHistorial", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          showAlert("Sesión expirada. Por favor inicia sesión nuevamente.", "warning");
          navigate("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setHistorial(data.historial || []);
        setSemestres(data.semestres || []);
      })
      .catch((err) => {
        console.error("Error al obtener historial:", err);
        setHistorial([]);
        setSemestres([]);
      });
  }, [navigate]);

  const renderSeccion = (semestre) => {
    const materias = historial.filter((h) => h.semestre === semestre);

    return (
      <div key={semestre} className="historial-semestre">
        <h3>Semestre {semestre}</h3>
        <table className="ets-table" >
          <thead>
            <tr>
              <th>Unidad de Aprendizaje</th>
              <th>Calificación Final</th>
              <th>Periodo</th>
              <th>Fecha</th>
              <th>Método Aprobado</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((m) => (
              <tr key={m.id}>
                <td>{m.unidad_aprendizaje}</td>
                <td>{m.calificacion_final}</td>
                <td>{m.periodo}</td>
                <td>{m.fecha}</td>
                <td>{m.metodo_aprobado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="alumno-container">
      
      <SidebarAlumno />

      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>KARDEX</h1>
          </div>

          <img src="/escom.png" alt="ESCOM" className="escom-logo" />
        </header>

        <section className="horario-section">
          

          {semestres.length > 0 ? (
            semestres.map((s) => renderSeccion(s))
          ) : (
            <p className="historial-empty">No hay registros disponibles.</p>
          )}
        </section>

      </main>

      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
}
