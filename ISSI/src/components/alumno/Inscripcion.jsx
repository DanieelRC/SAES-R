import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../Modal.jsx";
import "./Inscripcion.css";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function Inscripcion() {
  const { id } = useParams();
  const navigate = useNavigate();

  // PAGINACIÓN
const ITEMS_POR_PAGINA = 10;
const [paginaActual, setPaginaActual] = useState(1);


  // estados indispensables + resto
  const [grupos, setGrupos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [id_dis, setId_dis] = useState("");
  const [distri, setDistri] = useState([]);
  const [gruposagg, setGruposagg] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [borr, setBorr] = useState([]);
  const [idgru, setIdgru] = useState("");
  const [del, setdel] = useState(null);
  const [d, setd] = useState(null);
  const [cursadas, setCursadas] = useState([]);
  const [NoReinscripcion, setNoRe] = useState([]);

  // filtros del código 1
  const [filtroTurno, setFiltroTurno] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");

  // estados del código 2 (validaciones)
  const [tiempo, setTiempo] = useState(false);
  const [cita, setCita] = useState(false);
  const [promedio, setPromedio] = useState("");
  const [edo, setEdo] = useState("");
  const [carrera, setCarrera] = useState("");
  const [nombre, setNombre] = useState("");
  const [citas, setCitas] = useState("");

  const [horarios, setHorarios] = useState([]);

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const API = "/api1";

  const safe = (value, fallback) =>
    value !== null && value !== undefined ? value : fallback;

  const safeArray = (value) => (Array.isArray(value) ? value : []);

  // ========== Tiempo / Cita (código 2) ==========
  useEffect(() => {
    fetch(`${API}/TiempoReinscripcion`, { credentials: "include" })
      .then((res) => res.json()) // Parsear JSON incluso si es 404
      .then((data) => {
        // El endpoint devuelve 404 si no hay cita, pero aún incluye datos del alumno
        if (data.tiempo) {
          setTiempo(true);
        } else if (data.cita) {
          setCita(true);
          setCitas(data.citas);
        } else {
          setTiempo(true);
        }

        setPromedio(data.promedio);
        setEdo(data.edo);
        setNombre(data.nombre);
        setCarrera(data.carrera);
      })
      .catch((err) => console.log("Error en TiempoReinscripcion:", err));
  }, []);

  // ========== HISTORIAL CURSADAS ==========
  useEffect(() => {
    fetch(`${API}/ObtenerHistorial/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const nombres = safeArray(data?.historial).map(
          (h) => h.unidad_aprendizaje
        );
        setCursadas(nombres);
      })
      .catch(() => setCursadas([]));
  }, []);

  useEffect(() => {
  setPaginaActual(1);
}, [filtroTurno, filtroTipo, filtroGrupo, filtroSemestre]);


  // ========== BORRADOR ==========
  useEffect(() => {
    fetch(`${API}/ConsultarBorrador`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const borrData = Array.isArray(data?.horario) ? data.horario : [];
        setBorr(borrData);
      })
      .catch(() => setBorr([]));
  }, []);

  // ========== NO REINSCRIPCIÓN ==========
  useEffect(() => {
    fetch(`${API}/NoReinscripcion`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setNoRe(safeArray(data?.grupos)))
      .catch(() => setNoRe([]));
  }, []);

  // ========== GRUPOS DISPONIBLES ==========
  useEffect(() => {
    fetch(`${API}/Grupos/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setGrupos(safeArray(data?.grupos));
        setCreditos(safe(data?.creditos, 0));
      })
      .catch(() => {
        setGrupos([]);
        setCreditos(0);
      });
  }, [id]);

  const handleClickAbrir = (id) => {
    setModalOpen(true);
    setId_dis(id);
  };

  const obtenerHorarioDia = (arr, dia) => {
  if (!Array.isArray(arr)) return "";
  const h = arr.find((d) => d.dia === dia);
  return h ? `${h.hora_ini} - ${h.hora_fin}` : "";
};


  // ========== DISTRIBUCIÓN HORARIA ==========
  useEffect(() => {
    if (!modalOpen || !id_dis) return;

    fetch(`${API}/ObtenerDist/${id_dis}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDistri(safeArray(data?.Distri)))
      .catch(() => setDistri([]));
  }, [modalOpen, id_dis]);

  // ========== TEMPORALES ==========
  useEffect(() => {
    fetch(`${API}/Con`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setGruposagg(safeArray(data?.tempGrupo));
          setCreditos(safe(data?.creditos, 0));
          setHorarios(safeArray(data?.horarios));
        }
      })
      .catch(() => {});
  }, []); // Agregar dependencia vacía para ejecutar solo una vez

  const handleClickD = (id) => {
    setd(true);
    setIdgru(id);
  };

  // ========== ELIMINAR DE BORRADOR (temporal) ==========
  useEffect(() => {
    if (!d || !idgru) return;

    fetch(`${API}/EliminarBorrador/${idgru}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          showAlert("Se ha eliminado la materia del borrador", "success");
        } else {
          showAlert("No se pudo eliminar", "error");
        }
      })
      .finally(() => setd(false));
  }, [d, idgru]);

  // ========== AGREGAR A HORARIO ==========
const handleClickAdd = (id) => {
    if (!id) return;

    fetch(`${API}/Agregar/${id}`, {
        credentials: "include",
        method: "POST",
    })
    .then((res) => res.json())
    .then((data) => {
        if (data?.success) {
            showAlert(
                "Se ha agregado la materia",
                "success",
                "",
                () => window.location.reload() // se ejecuta solo después de Aceptar
            );
        } else {
            showAlert(
                `No se pudo agregar: ${safe(data?.err, "")}`,
                "error"
            );
        }
    });
};


  // ========== ELIMINAR DEL HORARIO ==========
  const handleClickEl = (id) => {
    fetch(`${API}/Del/${id}`, {
      credentials: "include",
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("Se ha eliminado la materia de tu horario", "success", "", () => window.location.reload());

        } else {
          showAlert("No se ha podido eliminar", "error");
        }
      });


  };

  // ========== IMPORTAR BORRADOR ==========
  const handleClickImport = () => {
    fetch(`${API}/ImportarHorario`, {
      credentials: "include",
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.fatal) showAlert(`NO SE AGREGÓ NADA: ${data.msg}`, "error");
        else if (data?.success){
          showAlert("Se importó correctamente", "success", "", () => window.location.reload());
        } 
        else showAlert(`Importado parcial: ${safe(data?.msg, "")}`, "warning");
      });
  };

  // ========== ELIMINAR BORRADOR FINAL ==========
  useEffect(() => {
    if (!del || !idgru) return;

    fetch(`${API}/EliminarBorrador/${idgru}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          showAlert("Se ha eliminado la materia del borrador", "success" , "", () => window.location.reload());
        } else {
          showAlert("No se ha podido eliminar", "error", "", () => window.location.reload());
        }
      })
      .finally(() => setdel(false));
      window.location.reload();

  }, [del, idgru]);

  // ========== INSCRIPCIÓN FINAL ==========
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API}/Inscribirse`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("Se ha inscrito satisfactoriamente", "success");
          setTimeout(() => {
            navigate(`/alumno/${id}`);
            window.location.reload();
          }, 1500);
        } else {
          showAlert(`Ha ocurrido un error: ${data.message}`, "error");
        }
      });
  };

  // ====== FILTRADO ======
const gruposFiltrados = grupos.filter((grupo) => {
  const matchTurno = !filtroTurno || grupo.turno === filtroTurno;
  const matchTipo =
    !filtroTipo || grupo.Unidad_Aprendizaje.tipo === filtroTipo;
  const matchGrupo =
    !filtroGrupo ||
    grupo.nombre.toLowerCase().includes(filtroGrupo.toLowerCase());
  const matchSemestre =
    !filtroSemestre || grupo.nombre.charAt(0) === filtroSemestre;

  return matchTurno && matchTipo && matchGrupo && matchSemestre;
});

// ====== PAGINACIÓN ======
const totalPaginas = Math.ceil(gruposFiltrados.length / ITEMS_POR_PAGINA);

const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
const fin = inicio + ITEMS_POR_PAGINA;

const gruposPaginados = gruposFiltrados.slice(inicio, fin);

  // ===================== RENDERS CONDICIONALES (opción A) =====================

  // 1) Si NO es tiempo y NO hay cita -> mostrar pantalla de bloqueo (no mostrar inscripción)
  if (!tiempo && !cita) {
    return (
      
      <section>
        <SidebarAlumno />
        <main className="main-content">
          <header className="chat-header">
          <div className="encabezado-section">
            <h1 className="titulo">Inscripción de Materias</h1>
          </div>
          <p className="descripcion">Realiza la inscripción de tus materias.</p>

          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>
        <section className="gestion-alumnos"> 
          <div className="inscripcion-container">
            <h1 className="titulo">No es tu tiempo de reinscripción</h1>
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Nombre:</strong> {nombre || "—"}
              </p>
              <p>
                <strong>Carrera:</strong> {carrera || "—"}
              </p>
              <p>
                <strong>Promedio:</strong> {promedio || "—"}
              </p>
              <p>
                <strong>Estado académico:</strong> {edo || "—"}
              </p>
              {edo === "Dictaminado" ? <strong> NO PUEDES INSCRIBIRTE DE MANERA NORMAL, ACUDE A GESTION ESCOLAR </strong> : " "}
              <p>Si crees que hay un error, contacta con la coordinación.</p>
            </div>
          </div>
          </section>
        </main>
      </section>
    );
  }

  // 2) Si hay cita pero no es tiempo -> mostrar la pantalla completa tipo código 2 (usuario pidió A)
  if (cita && !tiempo) {
    return (
      <section>
        <SidebarAlumno />
        <main className="main-content">
          <div className="inscripcion-container">
            <div className="tabla-contenedor">
              <h1 className="titulo">INSCRIPCIÓN DE MATERIAS</h1>

              <h2 className="titulo" style={{ marginTop: "1rem" }}>Nombre : {nombre}</h2>
              <h2 className="titulo">Carrera : {carrera}</h2>

              <section className="tabla-contenedor" style={{ marginTop: "1rem" }}>
                <table className="tabla-cursos">
                  <thead>
                    <tr>
                      <td>Creditos disponibles</td>
                      <td>Periodos cursados</td>
                      <td>Periodos disponibles para terminar la carrera</td>
                      <td>Promedio</td>
                      <td>Estado academico</td>
                      <td>Cita de reinscripción</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{creditos}</td>
                      <td>2</td>
                      <td>2</td>
                      <td>{promedio}</td>
                      <td>{edo}</td>
                      <td>{citas ? citas : <h3>No hay cita de reinscripcion</h3>}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </main>
      </section>
    );
  }

  // 3) Si es tiempo (tiempo === true) -> mostrar TODO el JSX de inscripción (código 1)
  return (
    <div className="inscripcion-container">
      <SidebarAlumno />

      {/* =============== CONTENIDO PRINCIPAL =============== */}
      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1 className="titulo">Inscripción de Materias</h1>
          </div>
          <p className="descripcion">Realiza la inscripción de tus materias.</p>

          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>

        <section className="gestion-alumnos">
          <div className="botones-superiores">

  <button
    type="button"
    className="btn azul"
    onClick={handleClickImport}
  >
    Importar del borrador
  </button>

  <button
    type="button"
    className="btn azul"
    onClick={() => setModalOpen2(true)}
  >
    Visualizar borrador de horario
  </button>

</div>


          {/* GRUPOS DISPONIBLES */}
          <section className="tabla-contenedor">
            <h1 className="titulo">Grupos disponibles</h1>

            <div
              className="button-gap"
              style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
            >
              <input
                type="text"
                placeholder="Buscar por grupo..."
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="btn-ver"
                style={{ padding: "0.5rem" }}
              />
              <select
                value={filtroTurno}
                onChange={(e) => setFiltroTurno(e.target.value)}
                className="btn-ver"
                style={{ padding: "0.5rem" }}
              >
                <option value="">Todos los turnos</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
              </select>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="btn-ver"
                style={{ padding: "0.5rem" }}
              >
                <option value="">Todos los tipos</option>
                <option value="OBLIGATORIA">OBLIGATORIA</option>
                <option value="OPTATIVA">OPTATIVA</option>
              </select>
              <select
                value={filtroSemestre}
                onChange={(e) => setFiltroSemestre(e.target.value)}
                className="btn-ver"
                style={{ padding: "0.5rem" }}
              >
                <option value="">Todos los semestres</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}° Semestre
                  </option>
                ))}
              </select>
            </div>

            <table className="tabla-cursos">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Unidad de Aprendizaje</th>
                  <th>Tipo</th>
                  <th>Créditos</th>
                  <th>Profesor</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes </th>
                  <th>Disponibilidad</th>
                  <th>Cupo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
  {gruposPaginados.length > 0 ? (
      gruposPaginados.map((grupo) => {
        const profesor = grupo.DatosPersonale;
        const distribsRaw = grupo.Distribucion || [];
        const distribs = Array.isArray(distribsRaw) ? distribsRaw : [distribsRaw];

        // función horarios por día
        const horasPorDia = (dia) => {
          if (dia === "Miércoles") {
            const vals = distribs
              .filter(
                (d) =>
                  d &&
                  (d.dia === "Miércoles" || d.dia === "Miércoles")
              )
              .map((d) => `${d.hora_ini} - ${d.hora_fin}`);
            return vals.join(", ");
          }
          const vals = distribs
            .filter((d) => d && d.dia === dia)
            .map((d) => `${d.hora_ini} - ${d.hora_fin}`);
          return vals.join(", ");
        };

        // validaciones
        const estaCursada = cursadas.includes(grupo.Unidad_Aprendizaje.nombre);
        const estaEnBorrador = gruposagg.includes(grupo.id);
        const noPermitida = NoReinscripcion.includes(
          grupo.Unidad_Aprendizaje.id
        );

        return (
          <tr key={grupo.id}>
            <td>{grupo.nombre}</td>
            <td>{grupo.Unidad_Aprendizaje.nombre}</td>
            <td>{grupo.Unidad_Aprendizaje.tipo}</td>
            <td>{grupo.Unidad_Aprendizaje.credito}</td>

            <td>
              {profesor.nombre} {profesor.ape_paterno} {profesor.ape_materno}
            </td>

            {/* HORARIOS */}
            <td>{horasPorDia("Lunes") || " "}</td>
            <td>{horasPorDia("Martes") || " "}</td>
            <td>{horasPorDia("Miércoles") || " "}</td>
            <td>{horasPorDia("Jueves") || " "}</td>
            <td>{horasPorDia("Viernes") || " "}</td>

            {/* DISPONIBILIDAD */}
            <td>
              <span
                className={`estado ${
                  grupo.cupo > 0 ? "disponible" : "lleno"
                }`}
              >
                {grupo.cupo > 0 ? "Disponible" : "Lleno"}
              </span>
            </td>

            <td>{grupo.cupo}</td>

            {/* ACCIONES */}
            <td>
              <button
                type="button"
                className="btn azul"
                onClick={() => handleClickAdd(grupo.id)}
                disabled={
                  grupo.cupo <= 0 ||
                  estaEnBorrador ||
                  estaCursada ||
                  noPermitida
                }
              >
                Seleccionar
              </button>
            </td>
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan="14">No hay grupos disponibles</td>
    </tr>
  )}
</tbody>

            </table>
          </section>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem" }}>
  
  
</div>
<div> 
<button
    className="btn-ver"
    disabled={paginaActual === 1}
    onClick={() => setPaginaActual(paginaActual - 1)}
  >
    Anterior
  </button>

  <span className="pagina-activa">
  {paginaActual} / {totalPaginas}
  </span>

  <button
    className="btn-ver"
    disabled={paginaActual === totalPaginas}
    onClick={() => setPaginaActual(paginaActual + 1)}
  >
    Siguiente
  </button>
  </div>


          {/* GRUPOS SELECCIONADOS */}
          <section className="tabla-contenedor" style={{ marginTop: "1.5rem" }}>
            <h1 className="titulo">Grupos seleccionados</h1>
            <h2 className="descripcion">Créditos restantes: {creditos}</h2>

            <table className="tabla-cursos">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Unidad de Aprendizaje</th>
                  <th>Tipo</th>
                  <th>Créditos</th>
                  <th>Profesor</th>
                  <th>Disponibilidad</th>
                  <th>Cupos</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
  {gruposagg.length > 0 ? (
    grupos
      .filter((grupo) => gruposagg.includes(grupo.id))
      .map((grupo) => {
        const index = gruposagg.indexOf(grupo.id);
        const horarioGrupo = horarios[index] || [];

        return (
          <tr key={grupo.id}>
            <td>{grupo.nombre}</td>
            <td>{grupo.Unidad_Aprendizaje.nombre}</td>
            <td>{grupo.Unidad_Aprendizaje.tipo}</td>
            <td>{grupo.Unidad_Aprendizaje.credito}</td>
            <td>
              {grupo.DatosPersonale.nombre} {grupo.DatosPersonale.ape_paterno}{" "}
              {grupo.DatosPersonale.ape_materno}
            </td>
            <td>
              <span
                className={`estado ${grupo.cupo > 0 ? "disponible" : "lleno"}`}
              >
                {grupo.cupo > 0 ? "Disponible" : "Lleno"}
              </span>
            </td>
            <td>{grupo.cupo}</td>

            {/* HORARIOS */}
            <td>{obtenerHorarioDia(horarioGrupo, "Lunes")}</td>
            <td>{obtenerHorarioDia(horarioGrupo, "Martes")}</td>
            <td>{obtenerHorarioDia(horarioGrupo, "Miércoles")}</td>
            <td>{obtenerHorarioDia(horarioGrupo, "Jueves")}</td>
            <td>{obtenerHorarioDia(horarioGrupo, "Viernes")}</td>

            <td>
              <button
                type="button"
                className="btn-ver"
                onClick={() => handleClickEl(grupo.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan="13">No hay grupos seleccionados</td>
    </tr>
  )}
</tbody>

            </table>

            <form className="resumen" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
              <button type="submit" className="btn azul">
                Realizar inscripción
              </button>
            </form>
          </section>

          {/* MODAL HORARIO */}
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="tabla-contenedor">
              <h2 className="titulo">Horario del Grupo</h2>
              <table className="tabla-horario">
                <thead>
                  <tr>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(
                      (dia) => (
                        <td key={dia}>
                          {distri
                            .filter((dis) => dis.dia === dia)
                            .map((dis, i) => (
                              <div key={i}>
                                {dis.hora_ini} - {dis.hora_fin}
                              </div>
                            ))}
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal>

          {/* MODAL BORRADOR */}
          <Modal open={modalOpen2} onClose={() => setModalOpen2(false)}>
            <div className="tabla-contenedor">
              <h1 className="titulo">Borrador de horario</h1>
              <table className="tabla-cursos" cellPadding={5}>
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Profesor</th>
                    <th>Calificación</th>
                    <th>Materia</th>
                    <th>Cupo</th>
                    <th>Créditos</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Válido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {borr.length > 0 ? (
                    borr.map((dato) => (
                      <tr key={dato.id}>
                        <td>{dato.Grupo.nombre}</td>
                        <td>
                          {dato.profesor.nombre} {dato.profesor.ape_paterno}{" "}
                          {dato.profesor.ape_materno}
                        </td>
                        <td>{dato.calificacion}</td>
                        <td>{dato.materia}</td>
                        <td>{dato.Grupo.cupo}</td>
                        <td>{dato.Grupo.Unidad_Aprendizaje.credito}</td>
                        <td>{dato.horas_lun || " "}</td>
                        <td>{dato.horas_mar || " "}</td>
                        <td>{dato.horas_mie || " "}</td>
                        <td>{dato.horas_jue || " "}</td>
                        <td>{dato.horas_vie || " "}</td>
                        <td>{dato.valido === 1 ? "Es válido" : "No válido"}</td>
                        <td>
                          <button
                            className="btn-ver"
                            onClick={() => handleClickD(dato.id_grupo)}
                          >
                            Retirar del borrador
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13">No hay datos disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Modal>
        </section>
      </main>
      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        type={alertState.type}
        title={alertState.title}
      />
    </div>
  );
}
