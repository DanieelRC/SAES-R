// PaseLista.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PaseLista.css";
import "./Profesor.css";
import { ProfesorLayout } from "./ProfesorLayout";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

import { useAuth } from "../../hooks/useAuth";

export function PaseLista() {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [profesorId, setProfesorId] = useState(user?.id);
  const ejecutadoRef = useRef(false);

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const API = "/api1";
  const { id } = useParams(); // id del grupo
  const navigate = useNavigate();

  // === FUNCIONALIDAD ORIGINAL (con protección de doble ejecución) ===
  useEffect(() => {
    if (ejecutadoRef.current) return;
    ejecutadoRef.current = true;

    fetch(`${API}/AlumnosInscritosPL/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAlumnos(data.alumnos);
          setProfesorId(data.profe);
        } else {
          try {
            showAlert(data.motivo || "Ya no puede pasar lista del día de hoy", "warning");
            setTimeout(() => {
              navigate(`/profesor/${data.profe || user?.id}`);
            }, 3000);
          } catch (error) {
             navigate(`/profesor/${user?.id}`);
          }
        }
      })
      .catch((err) =>
        console.error("Error al obtener los alumnos inscritos", err)
      );
  }, [id, navigate]);

  const handleSelectChange = (idAlumno, valor) => {
    setAsistencias((prev) => ({
      ...prev,
      [idAlumno]: valor,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataEnviar = Object.entries(asistencias).map(
      ([id_alumno, asistencia]) => ({
        id_alumno,
        asistencia,
      })
    );

    fetch(`${API}/GuardarAsistencias/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ grupo: id, asistencias: dataEnviar }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert(data.msg, "success");
          navigate(`/profesor/${data.profe}`);
        }
      })
      .catch((err) => console.error("Error al enviar asistencias:", err));
  };

  return (
    <ProfesorLayout profesorId={profesorId}>
      {/* Encabezado con el diseño moderno */}
      <div className="prof-page-header">
        <h1 className="prof-page-title">Pase de lista del grupo</h1>
        <div className="prof-page-header-right">
          <img
            src="/escom.png"
            alt="ESCOM"
            className="prof-page-escom-logo"
          />
        </div>
      </div>

      {/* Card de tabla estilo moderno */}
      <section className="prof-card pase-card">
        <form onSubmit={handleSubmit}>
          <div style={{ overflowX: "auto" }}>
          <table className="prof-table pase-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Asistencia</th>
              </tr>
            </thead>

            <tbody>
              {alumnos.length === 0 ? (
                <tr>
                  <td colSpan={2} className="pase-empty">
                    No hay alumnos inscritos en este grupo.
                  </td>
                </tr>
              ) : (
                alumnos.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>
                      {alumno.ape_paterno} {alumno.ape_materno}{" "}
                      {alumno.nombre}
                    </td>

                    <td>
                      <select
                        className="pase-select"
                        value={asistencias[alumno.id] || ""}
                        onChange={(e) =>
                          handleSelectChange(alumno.id, e.target.value)
                        }
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="Si">Asistencia</option>
                        <option value="No">Inasistencia</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>

          <div className="prof-actions">
            <button type="submit" className="prof-btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </section>

      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </ProfesorLayout>
  );
}
