// src/components/admin/InscripcionAdmin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import Modal from "../Modal";
import "./InscripcionAdmin.css";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

const API = "/api1";

export function InscripcionAdmin() {
  const { id } = useParams(); // boleta del alumno

  // Datos del alumno
  const [alumnoInfo, setAlumnoInfo] = useState(null);
  const [creditos, setCreditos] = useState(0);

  // Grupos
  const [cursos, setCursos] = useState([]); // todos los cursos del sistema
  const [gruposInscritos, setGruposInscritos] = useState([]); // grupos del alumno

  // Filtros / búsqueda
  const [busquedaGrupo, setBusquedaGrupo] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("todos");
  const [filtroCarreraGrupo, setFiltroCarreraGrupo] = useState("todas");
  const [filtroTurno, setFiltroTurno] = useState("todos");
    const [cursadas, setCursadas] = useState([]);
    const [NoReinscripcion, setNoReinscripcion] = useState([]);
    const safeArray = (value) => (Array.isArray(value) ? value : []);

  // Modal confirmación
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalContenido, setModalContenido] = useState("");
  const [modalAccion, setModalAccion] = useState(null);

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const norm = (x) => (x ?? "").toString().toLowerCase();

    useEffect(() => {
      fetch(`${API}/ObtenerHistorial/${id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const nombres = safeArray(data?.historial).map(
            (h) => h.unidad_aprendizaje
          );
          const materiasre = safeArray(data?.materiasreprobadas).map(
            (h) => h.id_ua
          );
          setCursadas(nombres);
          setNoReinscripcion(materiasre);
        })
        .catch(() => setCursadas([]));
    }, []);
  // ============================
  //  CARGA DE DATOS DESDE BD
  // ============================
  const cargarDatosAlumno = async () => {
    try {
      const res = await fetch(`${API}/AdminAlumnoDatos/${id}`, {
        credentials: "include",
      });
      console.log("GET AdminAlumnoDatos status:", res.status);
      const json = await res.json();
      console.log("AdminAlumnoDatos respuesta:", json);

      if (!json.success) {
        console.error("Error AdminAlumnoDatos:", json.error);
        return;
      }

      setAlumnoInfo({
        id: json.alumno.id,
        nombre: json.alumno.nombre,
        ape_paterno: json.alumno.ape_paterno,
        ape_materno: json.alumno.ape_materno,
        carrera: json.alumno.carrera,
      });
      setCreditos(json.estudiante.creditos_disponibles ?? 0);
    } catch (err) {
      console.error("Error al cargar AdminAlumnoDatos:", err);
    }
  };

  const cargarGruposInscritos = async () => {
    try {
      const res = await fetch(`${API}/AdminAlumnoInscripciones/${id}`, {
        credentials: "include",
      });
      console.log("GET AdminAlumnoInscripciones status:", res.status);
      const json = await res.json();
      console.log("AdminAlumnoInscripciones respuesta:", json);

      if (!json.success) {
        console.error("Error AdminAlumnoInscripciones:", json.error);
        setGruposInscritos([]);
        return;
      }
      setGruposInscritos(json.grupos || []);
    } catch (err) {
      console.error("Error al cargar AdminAlumnoInscripciones:", err);
    }
  };

  const cargarCursos = async () => {
    try {
      const res = await fetch(`${API}/ObtenerCursos`, {
        credentials: "include",
      });
      console.log("GET ObtenerCursos status:", res.status);
      const json = await res.json();
      console.log("ObtenerCursos respuesta cruda:", json);

      const cursosBD = Array.isArray(json.cursos) ? json.cursos : [];
      console.log("Número de cursos recibidos:", cursosBD.length);

      const cursosNormalizados = cursosBD.map((c) => {
        const ua = c.Unidad_Aprendizaje || {};
        const prof = c.DatosPersonale || c.DatosPersonales || {};

        return {
          idGrupo: c.id,
          grupo: c.nombre,
          turno: c.turno, // "Matutino" / "Vespertino"
          cupo: c.cupo,
          ua: ua.nombre,
          ua_id : ua.id,
          tipo: ua.tipo,
          creditos: ua.credito,
          carrera: ua.carrera,
          semestre: ua.semestre,
          profesor: `${prof.nombre || ""} ${prof.ape_paterno || ""} ${
            prof.ape_materno || ""
          }`.trim(),
        };
      });

      console.log("Cursos normalizados:", cursosNormalizados);
      setCursos(cursosNormalizados);
    } catch (err) {
      console.error("Error al cargar ObtenerCursos:", err);
    }
  };

  const recargarTodo = async () => {
    await Promise.all([
      cargarDatosAlumno(),
      cargarGruposInscritos(),
      cargarCursos(),
    ]);
  };

  useEffect(() => {
    if (!id) return;
    recargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ============================
  //  FILTROS / DISPONIBLES
  // ============================

  // IDs de grupos ya inscritos
  const idsGruposInscritos = useMemo(
    () => new Set(gruposInscritos.map((g) => g.id_grupo)),
    [gruposInscritos]
  );

  // 🔴 Para depurar: filtro súper simple, SOLO por texto
  const gruposDisponiblesFiltrados = useMemo(() => {
    if (!Array.isArray(cursos)) return [];
    return cursos.filter((g) => {
      const texto = norm(`${g.grupo} ${g.ua}`);
      return texto.includes(norm(busquedaGrupo));
    });
  }, [cursos, busquedaGrupo]);

  // ============================
  //  ACCIONES (+ / -)
  // ============================
  const abrirModalConfirmacion = (mensaje, accion) => {
    setModalContenido(mensaje);
    setModalAccion(() => accion);
    setModalAbierto(true);
  };

  const confirmarModal = () => {
    if (modalAccion) modalAccion();
    setModalAbierto(false);
    setModalAccion(null);
  };

  const cancelarModal = () => {
    setModalAbierto(false);
    setModalAccion(null);
  };

  const intentarInscribir = (grupo) => {
    abrirModalConfirmacion(
      `¿Deseas inscribir al alumno al grupo ${grupo.grupo}?`,
      () => inscribirGrupo(grupo.idGrupo)
    );
  };

  const intentarBaja = (grupo) => {
    abrirModalConfirmacion(
      `¿Deseas dar de baja al alumno del grupo ${grupo.grupo}?`,
      () => darBajaGrupo(grupo.id_grupo)
    );
  };

  const inscribirGrupo = async (idGrupo) => {
    try {
      const res = await fetch(
        `${API}/AdminAlumnoInscribirGrupo/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ idGrupo }),
        }
      );
      const data = await res.json();
      console.log("Respuesta AdminAlumnoInscribirGrupo:", data);

      if (!data.success) {
        showAlert(data.error || "No se pudo inscribir el grupo", "error");
      } else {
        showAlert("Grupo inscrito correctamente", "success");
      }

      await recargarTodo();
    } catch (err) {
      console.error("Error al inscribir grupo:", err);
      showAlert("Error al inscribir grupo", "error");
    }
  };

  const darBajaGrupo = async (idGrupo) => {
    try {
      const res = await fetch(
        `${API}/AdminAlumnoBajaGrupo/${id}/${idGrupo}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("Respuesta AdminAlumnoBajaGrupo:", data);

      if (!data.success) {
        showAlert(data.error || "No se pudo dar de baja el grupo", "error");
      } else {
        showAlert("Grupo dado de baja correctamente", "success");
      }

      await recargarTodo();
    } catch (err) {
      console.error("Error al dar de baja grupo:", err);
      showAlert("Error al dar de baja grupo", "error");
    }
  };

  // ============================
  //  RENDER
  // ============================
  return (
    <div className="layout">
      <AdminSidebar />

      <main className="contenido inscripcion-admin-main">
        {/* ENCABEZADO */}
        <section className="inscripcion-header">
          <div>
            <h1>INSCRIPCIÓN DE MATERIAS (ADMINISTRADOR)</h1>
            <p>
              Administra la inscripción de materias para el alumno seleccionado.
            </p>
          </div>
          <div className="inscripcion-logo-escom">
            <img src="/escom.png" alt="ESCOM" />
          </div>
        </section>

        {/* DATOS DEL ALUMNO */}
        <section className="inscripcion-card">
          <h2>Datos del alumno</h2>
          {alumnoInfo ? (
            <div className="datos-alumno-resumen">
              <p>
                <strong>Boleta:</strong> {alumnoInfo.id}
              </p>
              <p>
                <strong>Nombre:</strong>{" "}
                {alumnoInfo.nombre} {alumnoInfo.ape_paterno}{" "}
                {alumnoInfo.ape_materno}
              </p>
              <p>
                <strong>Carrera:</strong> {alumnoInfo.carrera}
              </p>
              <p>
                <strong>Créditos disponibles:</strong> {creditos}
              </p>
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>
              No se pudieron cargar los datos del alumno.
            </p>
          )}
        </section>

        {/* OFERTA DE GRUPOS */}
        <section className="inscripcion-card">
          <h2>Oferta de grupos (proceso de inscripción)</h2>

          {/* Para depurar: muestra cuántos cursos hay realmente */}
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Cursos cargados desde BD: <strong>{cursos.length}</strong>
          </p>

          {/* Filtros (por ahora solo afecta la búsqueda de texto) */}
          <div className="filtros-inscripcion">
            <input
              type="text"
              placeholder="Buscar por grupo o materia..."
              value={busquedaGrupo}
              onChange={(e) => setBusquedaGrupo(e.target.value)}
            />

            <select
              value={filtroSemestre}
              onChange={(e) => setFiltroSemestre(e.target.value)}
            >
              <option value="todos">Todos los semestres</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>

            <select
              value={filtroCarreraGrupo}
              onChange={(e) => setFiltroCarreraGrupo(e.target.value)}
            >
              <option value="todas">Todas las carreras</option>
              <option value="ingenieria en inteligencia artificial">
                Ingeniería en Inteligencia Artificial
              </option>
              <option value="ingenieria en ciencia de datos">
                Ingeniería en Ciencia de Datos
              </option>
              <option value="ingenieria en sistemas computacionales">
                Ingeniería en Sistemas Computacionales
              </option>
            </select>

            <select
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value)}
            >
              <option value="todos">Todos los turnos</option>
              <option value="matutino">Matutino</option>
              <option value="vespertino">Vespertino</option>
            </select>
          </div>

          {/* Tabla de oferta */}
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Unidad de Aprendizaje</th>
                  <th>Tipo</th>
                  <th>Créditos</th>
                  <th>Carrera</th>
                  <th>Semestre</th>
                  <th>Profesor</th>
                  <th>Turno</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {gruposDisponiblesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No hay grupos disponibles con los filtros actuales.
                    </td>
                  </tr>
                ) : (
                  gruposDisponiblesFiltrados.map((g) => {
                    const yaInscrito = idsGruposInscritos.has(g.idGrupo);
                    const estaCursada = cursadas.includes(g.ua);
                    const noReinscribe = NoReinscripcion.includes(String(g.ua_id));

                    return (
                      <tr key={g.idGrupo}>
                        <td>{g.grupo}</td>
                        <td>{g.ua}</td>
                        <td>{g.tipo}</td>
                        <td>{g.creditos}</td>
                        <td>{g.carrera}</td>
                        <td>{g.semestre}</td>
                        <td>{g.profesor}</td>
                        <td>{g.turno}</td>
                        <td style={{ textAlign: "center" }}>
                          {yaInscrito ? (
                            <button
                              className="btn-secundario"
                              onClick={() =>
                                intentarBaja(
                                  gruposInscritos.find(
                                    (gi) => gi.id_grupo === g.idGrupo
                                  ) || {
                                    id_grupo: g.idGrupo,
                                    grupo: g.grupo,
                                  }
                                )
                              }
                            >
                              -
                            </button>
                          ) : (
                            <button
                              className="btn-primario"
                              disabled = {
                                estaCursada || noReinscribe
                              }
                              onClick={() => intentarInscribir(g)}
                            >
                              +
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* HORARIO ACTUAL DEL ALUMNO */}
        <section className="inscripcion-card">
          <h2>Horario actual del alumno</h2>

          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Unidad de Aprendizaje</th>
                  <th>Tipo</th>
                  <th>Créditos</th>
                  <th>Profesor</th>
                  <th>Turno</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {gruposInscritos.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      El alumno aún no tiene grupos inscritos.
                    </td>
                  </tr>
                ) : (
                  
                  gruposInscritos.map((g) => (
                    
                    <tr key={g.id_mat_inscrito}>
                      <td>{g.grupo}</td>
                      <td>{g.ua}</td>
                      <td>{g.tipo}</td>
                      <td>{g.creditos}</td>
                      <td>{g.profesor}</td>
                      <td>{g.turno}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn-secundario"
                          onClick={() => intentarBaja(g)}
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

         {/* MODAL CONFIRMACIÓN */}
        {modalAbierto && (
          <Modal onClose={cancelarModal}>
            <p>{modalContenido}</p>
            <div className="modal-actions">
              <button className="btn-secundario" onClick={cancelarModal}>
                Cancelar
              </button>
              <button className="btn-primario" onClick={confirmarModal}>
                Aceptar
              </button>
            </div>
          </Modal>
        )}
        <Modal open={modalAbierto} onClose={cancelarModal}>
          <p>{modalContenido}</p>
          <div className="modal-actions">
            <button className="btn-secundario" onClick={cancelarModal}>
              Cancelar
            </button>
            <button className="btn-primario" onClick={confirmarModal}>
              Aceptar
            </button>
          </div>
        </Modal>

        {/* Modal de alertas */}
        <AlertModal
          isOpen={alertState.isOpen}
          onClose={hideAlert}
          message={alertState.message}
          type={alertState.type}
        />
      </main>
    </div>
  );
}