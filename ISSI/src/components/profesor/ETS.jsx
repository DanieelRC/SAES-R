import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ETS.css";
import { ProfeSideBar } from "./ProfeSidebar.jsx";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function ETS() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API = '/api1';

  const [gruposETS, setGruposETS] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [alumnosETS, setAlumnosETS] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [fechaValida, setFechaValida] = useState(false);
  const [mensajeFecha, setMensajeFecha] = useState("Cargando...");
  const [loading, setLoading] = useState(true);

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  // Validar fecha de evaluación ETS
  useEffect(() => {
    fetch(`${API}/ValidarFechaETS`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setFechaValida(data.valido || false);
        setMensajeFecha(data.mensaje || "Error al validar fecha");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al validar fecha ETS:", err);
        setFechaValida(false);
        setMensajeFecha("Error al validar la fecha de evaluación ETS");
        setLoading(false);
      });
  }, []);

  // Obtener grupos ETS asignados al profesor
  useEffect(() => {
    if (id) {
      console.log("Buscando grupos ETS para profesor ID:", id);
      fetch(`${API}/ObtenerMisGruposETS/${id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          console.log("Tipo de data.success:", typeof data.success, "Valor:", data.success);
          console.log("Grupos en data:", data.grupos);
          if (data.success) {
            console.log("Grupos encontrados:", data.grupos);
            setGruposETS(data.grupos || []);
          } else {
            console.log("No se encontraron grupos o hubo un error");
            console.log("Estructura completa de data:", JSON.stringify(data, null, 2));
          }
        })
        .catch((err) => console.error("Error al obtener grupos ETS:", err));
    } else {
      console.log("No hay ID de profesor");
    }
  }, [id]);

  // Cargar alumnos del grupo ETS seleccionado
  const handleSeleccionarGrupo = (grupo) => {
    setGrupoSeleccionado(grupo);
    
    fetch(`${API}/ObtenerAlumnosETS/${grupo.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAlumnosETS(data.alumnos || []);
          // Inicializar calificaciones guardadas
          const cals = {};
          data.alumnos.forEach((alumno) => {
            cals[alumno.id_ets] = alumno.calificado || "";
          });
          setCalificaciones(cals);
        }
      })
      .catch((err) => console.error("Error al obtener alumnos ETS:", err));
  };

  const handleVolverLista = () => {
    setGrupoSeleccionado(null);
    setAlumnosETS([]);
    setCalificaciones({});
  };

  const handleCalificacionChange = (idETS, valor) => {
    setCalificaciones({
      ...calificaciones,
      [idETS]: valor,
    });
  };

  const handleGuardarCalificaciones = async () => {
    try {
      // Validar que todas las calificaciones estén entre 0 y 10
      const calificacionesArray = Object.entries(calificaciones).map(([idETS, cal]) => ({
        id_ets: idETS,
        calificacion: cal === "" ? null : parseFloat(cal),
      }));

      for (const item of calificacionesArray) {
        if (item.calificacion !== null && (item.calificacion < 0 || item.calificacion > 10)) {
          showAlert("Las calificaciones deben estar entre 0 y 10", "warning");
          return;
        }
      }

      const response = await axios.post(
        `${API}/RegistrarCalificacionesETS`,
        { calificaciones: calificacionesArray },
        { withCredentials: true }
      );

      if (response.data.success) {
        showAlert("Calificaciones guardadas exitosamente", "success");
        handleVolverLista();
      } else {
        showAlert(response.data.mensaje || "Error al guardar calificaciones", "error");
      }
    } catch (err) {
      console.error("Error al guardar calificaciones ETS:", err);
      showAlert("Error al guardar las calificaciones. Intenta nuevamente.", "error");
    }
  };

  if (loading) {
    return (
      <div className="profesor-container">
        <ProfeSideBar />
        <main className="main-content">
          <div className="loading-message">Cargando...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="profesor-container">
      <ProfeSideBar />

      <main className="main-content">
        <header className="ets-header">
          <div className="encabezado-section">
            <h1>Evaluación de ETS</h1>
          </div>
          <p>Gestiona las evaluaciones de Exámenes a Título de Suficiencia</p>
          <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
        </header>

        {!fechaValida ? (
          <section className="mensaje-no-disponible">
            <div className="mensaje-card">
              <h3>{mensajeFecha}</h3>
              <p>La evaluación de ETS solo está disponible en la fecha indicada por la institución.</p>
            </div>
          </section>
        ) : !grupoSeleccionado ? (
          <section className="lista-grupos-ets">
            <div className="lista-header">
              <h2>Mis Grupos ETS Asignados</h2>
              <p>Selecciona un grupo para evaluar a los alumnos</p>
            </div>

            {gruposETS.length === 0 ? (
              <div className="sin-grupos">
                <p>No tienes grupos ETS asignados en este momento.</p>
              </div>
            ) : (
              <div className="tabla-container">
                <table className="tabla-grupos-ets">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Unidad de Aprendizaje</th>
                      <th>Turno</th>
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gruposETS.map((grupo, index) => (
                      <tr key={grupo.id}>
                        <td>{index + 1}</td>
                        <td className="nombre-ua">{grupo.nombre_ua}</td>
                        <td>{grupo.turno}</td>
                        <td>{new Date(grupo.fecha).toLocaleDateString('es-MX')}</td>
                        <td>{grupo.hora_inicio} - {grupo.hora_final}</td>
                        <td>
                          <button
                            className="btn-evaluar"
                            onClick={() => handleSeleccionarGrupo(grupo)}
                          >
                            Evaluar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="botones-container">
              <div>
              <button
                type="button"
                className="btn blanco"
                onClick={() => navigate(`/profesor/${id}`)}
              >
                Volver al inicio
              </button>
              </div> 
            </div>
          </section>
        ) : (
          <section className="evaluacion-ets">
            <div className="grupo-evaluando">
              <div>
                <h2>Evaluando: {grupoSeleccionado.nombre_ua}</h2>
                <p className="info-grupo">
                  {grupoSeleccionado.turno} | {new Date(grupoSeleccionado.fecha).toLocaleDateString('es-MX')} | 
                  {grupoSeleccionado.hora_inicio} - {grupoSeleccionado.hora_final}
                </p>
              </div>
              <button className="btn-volver-lista" onClick={handleVolverLista}>
                ← Volver a la lista
              </button>
            </div>

            {alumnosETS.length === 0 ? (
              <div className="sin-alumnos">
                <p>No hay alumnos registrados para este grupo ETS.</p>
              </div>
            ) : (
              <>
                <div className="tabla-container">
                  <table className="tabla-alumnos-ets">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Boleta</th>
                        <th>Nombre Completo</th>
                        <th>Unidad de Aprendizaje</th>
                        <th>Calificación (0-10)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosETS.map((alumno, index) => (
                        <tr key={alumno.id_ets}>
                          <td>{index + 1}</td>
                          <td>{alumno.boleta}</td>
                          <td className="nombre-alumno">
                            {alumno.nombre} {alumno.ape_paterno} {alumno.ape_materno}
                          </td>
                          <td>{alumno.nombre_ua}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={calificaciones[alumno.id_ets] || ""}
                              onChange={(e) =>
                                handleCalificacionChange(alumno.id_ets, e.target.value)
                              }
                              className="input-calificacion"
                              placeholder="0.0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="botones-container">
                  <button className="btn-guardar" onClick={handleGuardarCalificaciones}>
                    Guardar Calificaciones
                  </button>
                  <button className="btn-cancelar" onClick={handleVolverLista}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </section>
        )}
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
