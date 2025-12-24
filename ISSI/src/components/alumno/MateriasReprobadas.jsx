import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Modal";
import "./MateriasReprobadas.css";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";


export function MateriasReprobadas() {
  const [materias, setMaterias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [compro, setComprobante] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenCom, setModalOpenCom] = useState(false);
  const [modalOpenH, setModalOpenH] = useState(false);
  const [documento, setDocumento] = useState(null);
  const [id_mr, setIDMR] = useState("");
  const [id_grupo, setIDGRU] = useState("");
  const [tiempo, setTiempo] = useState(false);
  const [tiempoSubirComprobante , setTiempoSubirComprobante] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const [periodo, setPeriodo] = useState("");
  const API = "/api1";

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const navigate = useNavigate();
  const { id } = useParams();

  // ================== DATOS REALES DESDE BACKEND ==================
  useEffect(() => {
    fetch(`${API}/ObtenerMateriasReprobadas`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setMaterias(data.materias);
        setComprobante(data.compro);
      })
      .catch((err) =>
        console.error("Error al obtener la informacion: ", err)
      );
  }, []);
  useEffect(()=>{
    fetch(`${API}/TiempoInscripcionETS`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) =>{
      if(data.success){
        setTiempo(true)
      }else{
        setTiempo(false)
      }
    }).catch((err) => console.log("Error"));
  }, []);
  useEffect(() =>{
    fetch(`${API}/TiempoSubirComprobante`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) =>{
      if(data.success){
        setTiempoSubirComprobante(true)
      }else{
        setTiempoSubirComprobante(false)
      }
    }).catch((err) => console.log("Error"));
  }, [])

  // ================== LÓGICA DE PAGINACIÓN ==================
  const gruposMatutinos = horarios.filter((h) => h.turno === "Matutino");
  const gruposVespertinos = horarios.filter((h) => h.turno === "Vespertino");
  const maxGrupos = Math.max(gruposMatutinos.length, gruposVespertinos.length);
  
  const grupoMatutinoActual = gruposMatutinos[paginaActual];
  const grupoVespertinoActual = gruposVespertinos[paginaActual];

  const handleSiguiente = () => {
    if (paginaActual < maxGrupos - 1) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handleAnterior = () => {
    if (paginaActual > 0) {
      setPaginaActual(paginaActual - 1);
    }
  };

  // ================== LÓGICA DE ETS / COMPROBANTES ==================

  // Traer grupos ETS y abrir modal de horarios
  // Traer grupos ETS y abrir modal de horarios
  const handleClickIns = (idUnidadAprendizaje, idMateriaReprobada) => {
    setIDMR(idMateriaReprobada);
    setPaginaActual(0);
    // Encode the parameter to handle special characters or spaces
    fetch(`${API}/ObtenerGruposEts/${encodeURIComponent(idUnidadAprendizaje)}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener grupos");
        return res.json();
      })
      .then((data) => {
        setHorarios(data.horarios || []);
        setModalOpen(true);
      })
      .catch((err) => {
        console.error("Error", err);
        showAlert("No se pudieron cargar los grupos de ETS.", "error");
      });
  };

  // Inscribir ETS en un grupo (desde el modal)
  const handleI = (id_grupo) => {
    fetch(`${API}/RegistrarETS`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_mr,
        id_grupo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
            setModalOpenH(false)          
          showAlert("Se ha inscrito satisfactoriamente al ETS", "success"
            , ()=>window.location.reload()
          );
        } else {
          setModalOpenH(false)          
          showAlert(
            "No se ha podido registrar el ETS debido a que " + data.message,
            "error",
             ()=>window.location.reload()
          );
        }
        navigate(`/alumno/MateriasReprobadas`);
        
      })
      .catch((err) => console.log("Error", err));
  };

  // Preparar datos y abrir modal de comprobante
  const handleM = (id_grupo, id_mr) => {
    setIDMR(id_mr);
    setIDGRU(id_grupo);
    setModalOpenCom(true);
  };

  // Subir comprobante
  const handleSC = () => {
    fetch(`${API}/SubirComprobante`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_grupo,
        id_mr,
        documento,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("Se ha subido correctamente el comprobante", "success");
          navigate(`/alumno/MateriasReprobadas`);
          window.location.reload();
        }
      })
      .catch((err) => console.log("Error", err));
  };

  // Traer historial y abrir modal de historial
  const handleHistor = (idMateria) => {
    fetch(`${API}/ObtenerHistorialETS/${idMateria}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setHistorial(data.historial);
        setModalOpenH(true);
      })
      .catch((err) => console.error("Error", err));
  };

  return (
    <div className="alumno-container">
      <SidebarAlumno />

      {/* =============== CONTENIDO PRINCIPAL =============== */}
      <main className="main-content">
        <header className="chat-header">
          <div className ="encabezado-section">
            <h1>Materias reprobadas</h1>
            </div>
            <p>Consulta tus ETS, comprobantes y historial.</p>
          
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />

        </header>

        <section className="horario-section materias-section">
          <h2>Listado de materias reprobadas</h2>

          <table className="materias-table">
            <thead>
              <tr>
                <th>Materia</th>
                <th>Créditos</th>
                <th>Periodos restantes</th>
                <th>Recurse disponible</th>
                <th>Estado actual</th>
                <th>Acciones</th>
              </tr>
            </thead>

           <tbody>
  {materias.length > 0 ? (
    materias.map((materia) => {
      // ETS de esta materia con calificación 0
      const etsEnCurso = compro.find(
        (c) => c.id_mr === materia.id && c.calificado === 0
      );

      // ETS validado
      const etsValidado = compro.find(
        (c) => c.id_mr === materia.id && c.validado === 1
      );

      // Si existe un ETS (puede tener comprobante o no)
      const ets = compro.find((c) => c.id_mr === materia.id);

      return (
        <tr key={materia.id}>
          <td>{materia.Unidad_Aprendizaje.nombre}</td>
          <td>{materia.Unidad_Aprendizaje.credito}</td>
          <td>{materia.periodos_restantes}</td>
          <td>{materia.recurse === 1 ? "Sí" : "No"}</td>
          <td>{materia.estado_actual}</td>

          <td>
            {(() => {
              // ============================
              // 1) ETS VALIDADO
              // ============================
      

              // ============================
              // 2) Existe un ETS en curso (calificado = 0)
              // ============================
              if (etsEnCurso) {
                // Tiene comprobante subido

                if (etsValidado) {
                return (
                  <button className="btn blanco" disabled>
                    EL COMPROBANTE ESTÁ VALIDADO
                  </button>
                );
              }
              
                if (etsEnCurso.comprobante) {
                  return (
                    <button className="btn blanco" disabled>
                      Comprobante subido
                    </button>
                  );
                }

                // ETS, sin comprobante aún
                if (materia.estado_actual === "ETS") {
                  return (
                    <button
                      onClick={() =>
                        handleM(etsEnCurso.id_grupo, etsEnCurso.id_mr)
                      }
                      disabled={!tiempoSubirComprobante}
                    >
                      Subir comprobante de ETS
                    </button>
                  );
                }
                
              }

              // ============================
              // 3) NO se puede inscribir (Recurse / Desfasada)
              // ============================
              if (
                materia.estado_actual === "Recurse" || (materia.periodos_restantes <= 0 && materia.estado_actual === "Desfasada")
              ) {
                return " ";
              }

              // ============================
              // 4) NO existe ETS → mostrar Inscribir ETS
              // ============================
              const yaTieneETS = etsEnCurso !== undefined;

              return (
                <button
                  onClick={() =>
                    handleClickIns(
                      materia.Unidad_Aprendizaje.nombre,
                      materia.id
                    )
                  }
                  disabled={yaTieneETS || !tiempo}
                  style={yaTieneETS ? { opacity: 0.5 } : undefined}
                >
                  Inscribir ETS
                </button>
              );
            })()}

            <br />

            <button
              className="btn blanco"
              onClick={() => handleHistor(materia.id)}
            >
              Revisar historial de ets
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="6">NO TIENES MATERIAS REPROBADAS</td>
    </tr>
  )}
</tbody>

          </table>
        </section>
      </main>

      {/* =============== MODAL: HORARIOS ETS CON PAGINACIÓN =============== */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="ets-container">
          <h1 className="ets-title">Horarios para inscribir ETS</h1>

          {horarios.length === 0 ? (
            <p className="ets-empty">
              No hay grupos disponibles para esta unidad de aprendizaje.
            </p>
          ) : (
            <>
              <div className="ets-grid">
                {/* MATUTINO */}
                <div className="ets-card">
                  <h2 className="ets-subtitle">Matutino</h2>
                  {grupoMatutinoActual ? (
                    <>
                      <div className="ets-info">
                        <p>
                          <strong>Turno:</strong> {grupoMatutinoActual.turno}
                        </p>
                        <p>
                          <strong>Horas:</strong>{" "}
                          {grupoMatutinoActual.hora_inicio} -{" "}
                          {grupoMatutinoActual.hora_final}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {grupoMatutinoActual.fecha}
                        </p>
                        <p>
                          <strong>Aplicante:</strong>{" "}
                          {grupoMatutinoActual.DatosPersonale?.nombre}{" "}
                          {grupoMatutinoActual.DatosPersonale?.ape_paterno}{" "}
                          {grupoMatutinoActual.DatosPersonale?.ape_materno}
                        </p>

                        <p>
                          <strong>Cupo:</strong>{" "}
                          {grupoMatutinoActual.cupo}
                        </p>
                      </div>
                      

                      <button
                        onClick={() => handleI(grupoMatutinoActual.id)}
                        className="ets-btn-inscribir"
                        disabled = {Number(grupoMatutinoActual.cupo) <= 0}
                      >
                        Inscribir
                      </button>
                    </>
                  ) : (
                    <p>No hay grupos matutinos disponibles en esta página.</p>
                  )}
                </div>

                {/* VESPERTINO */}
                <div className="ets-card">
                  <h2 className="ets-subtitle">Vespertino</h2>
                  {grupoVespertinoActual ? (
                    <>
                      <div className="ets-info">
                        <p>
                          <strong>Turno:</strong> {grupoVespertinoActual.turno}
                        </p>
                        <p>
                          <strong>Horas:</strong>{" "}
                          {grupoVespertinoActual.hora_inicio} -{" "}
                          {grupoVespertinoActual.hora_final}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {grupoVespertinoActual.fecha}
                        </p>
                        <p>
                          <strong>Aplicante:</strong>{" "}
                          {grupoVespertinoActual.DatosPersonale?.nombre}{" "}
                          {grupoVespertinoActual.DatosPersonale?.ape_paterno}{" "}
                          {grupoVespertinoActual.DatosPersonale?.ape_materno}
                        </p>
                        <p>
                          <strong>Cupo:</strong>{" "}
                          {grupoVespertinoActual.cupo}
                        </p>
                      </div>

                      <button
                        onClick={() => handleI(grupoVespertinoActual.id)}
                        disabled={Number(grupoVespertinoActual.cupo) <= 0}
                        className="ets-btn-inscribir"
                      >
                        Inscribir
                      </button>
                    </>
                  ) : (
                    <p>No hay grupos vespertinos disponibles en esta página.</p>
                  )}
                </div>
              </div>

              {/* CONTROLES DE PAGINACIÓN */}
              <div className="ets-pagination">
                <button
                  onClick={handleAnterior}
                  disabled={paginaActual === 0}
                  className="ets-btn-paginacion"
                >
                  ← Anterior
                </button>
                <span className="ets-pagina-info">
                  Página {paginaActual + 1} de {maxGrupos}
                </span>
                <button
                  onClick={handleSiguiente}
                  disabled={paginaActual === maxGrupos - 1}
                  className="ets-btn-paginacion"
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}

          <div className="ets-footer">
            <button
              className="ets-btn-cerrar"
              onClick={() => setModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* =============== MODAL: SUBIR COMPROBANTE =============== */}
      <Modal open={modalOpenCom} onClose={() => setModalOpenCom(false)}>
        <div className="ets-container">
          <h1 className="ets-title">Comprobante de pago (solo PDF)</h1>
          <div className="form-group">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return setDocumento(null);

                if (file.type !== "application/pdf") {
                  showAlert("Solo se permiten archivos PDF.", "warning");
                  e.target.value = "";
                  setDocumento(null);
                  return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                  const full = reader.result;
                  const base64 = full.split(",")[1];
                  setDocumento(base64);
                };
                reader.readAsDataURL(file);
              }}
            />

            {documento && (
              <div className="file-ok">
                <p>
                  <strong>Archivo seleccionado:</strong> PDF cargado
                  correctamente ✅
                </p>
              </div>
            )}

            <button onClick={handleSC} className="ets-btn-inscribir">
              Subir comprobante
            </button>
          </div>
        </div>
      </Modal>

      {/* =============== MODAL: HISTORIAL ETS =============== */}
      <Modal open={modalOpenH} onClose={() => setModalOpenH(false)}>
        <div className="ets-container">
          <h1 className="modal-historial-title">Historial de ETS</h1>
          <div style={{ overflowX: "auto" }}>
          <table className="modal-historial-table">
            <thead>
              <tr>
                <th>Aplicante</th>
                <th>Turno</th>
                <th>Fecha</th>
                <th>Calificación</th>
              </tr>
            </thead>

            <tbody>
              {historial.length > 0 ? (
                historial.map((dato, index) => (
                  <tr key={index}>
                    <td>
                      {dato.ETS_Grupo.DatosPersonale?.nombre}{" "}
                      {dato.ETS_Grupo.DatosPersonale?.ape_paterno}{" "}
                      {dato.ETS_Grupo.DatosPersonale?.ape_materno}
                    </td>
                    <td>{dato.ETS_Grupo.turno}</td>
                    <td>{dato.ETS_Grupo.fecha}</td>
                    <td>{dato.calificado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <div className="ets-footer">
            <button
              className="ets-btn-cerrar"
              onClick={() => setModalOpenH(false)}
            >
              Cerrar
            </button>
          </div>

        </div>
      </Modal>

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