import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiEye, FiDownload } from "react-icons/fi";
import Modal from "../Modal";
import  "./Horarios.css";
import Stars from "../alumno/Stars.jsx";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";


export default function Horarios({ alumnoId: propAlumnoId, onClose }) {
  const params = useParams();
  const [datos, setDatos] = useState([]);
  const [borr, setBorr] = useState([]);
  const [cursadas, setCursadas] = useState([]);
  const [carrera, setCarrera] = useState("");
  const [modalResenas, setModalResenas] = useState(false);
  const alumnoId = propAlumnoId || params.id;
  const [resenas, setResenas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 10;

  // ===== FILTROS =====
const [filtroMateria, setFiltroMateria] = useState("");
const [filtroProfesor, setFiltroProfesor] = useState("");
const [filtroTurno, setFiltroTurno] = useState("");
const [filtroCarrera, setFiltroCarrera] = useState("");

// ===== DATOS FILTRADOS =====
const datosFiltrados = datos.filter((dato) => {
  const matchMateria =
    !filtroMateria ||
    dato.Unidad_Aprendizaje?.nombre
      ?.toLowerCase()
      .includes(filtroMateria.toLowerCase());

  const matchProfesor =
    !filtroProfesor ||
    `${dato.DatosPersonale?.nombre || ""} ${dato.DatosPersonale?.ape_paterno || ""} ${dato.DatosPersonale?.ape_materno || ""}`
      .toLowerCase()
      .includes(filtroProfesor.toLowerCase());

  const matchTurno = !filtroTurno || dato.turno === filtroTurno;

  const matchCarrera = filtroCarrera
  ? dato.Unidad_Aprendizaje?.carrera?.toLowerCase() ===
    filtroCarrera.toLowerCase()
  : true;

  return matchMateria && matchProfesor && matchTurno && matchCarrera;
});


  const [add, setAdd] = useState(null);
  const [idgru, setIdgru] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [del, setdel] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const API = "/api1";

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const safeArray = (value) => (Array.isArray(value) ? value : []);

    useEffect(() => {
      fetch(`${API}/ObtenerHistorial`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const nombres = safeArray(data?.historial).map(
            (h) => h.unidad_aprendizaje
          );
          setCursadas(nombres);
          setCarrera(data.carrera);
        })
        .catch(() => setCursadas([]));
    }, []);

  useEffect(() => {
    fetch(`${API}/ObtenerGrupo`, { credentials: "include", })
      .then((res) => res.json())
      .then((data) => {
        const cursos = Array.isArray(data && data.cursos) ? data.cursos : [];
        setDatos(cursos);
        console.log('ObtenerGrupo response count =', cursos.length);
      })
      .catch((err) => {
        console.error("Error al obtener los cursos:", err);
        setDatos([]);
      });
  }, []);

  useEffect(() => {
    fetch(`${API}/ConsultarBorrador`, { credentials: "include", })
      .then((res) => res.json())
      .then((data) => {
        const borr = Array.isArray(data && data.horario) ? data.horario : [];
        setBorr(borr);
        console.log('ObtenerGrupo response count =', borr.length);
      })
      .catch((err) => {
        console.error("Error al obtener el horario:", err);
        setBorr([]);
      });
  }, []);


  const handleClickAdd = (id) => {
    setAdd(true);
    setIdgru(id);
  }

  const handleClickDel = (id) => {
    setdel(true);
    setIdgru(id);
  }

  const handleClickResena = (id) =>{

    fetch(`${API}/ConsultarResenas/${id}`, { credentials: "include", })
      .then((res) => res.json())
      .then((data) => {
        const rese = Array.isArray(data && data.resenas) ? data.resenas : [];
        setResenas(rese);
      })
      .catch((err) => {
        console.error("Error al obtener las resenas:", err);
        setResenas([]);
      });

      setModalResenas(true);
  }

  useEffect(() => {
    if (add) {
      fetch(`${API}/AgregarBorrador/${idgru}`, { method: "POST", credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showAlert("Se ha agregado exitosamente a tu borrador de horario la materia", "success");
            setTimeout(() => window.location.reload(), 1500);
          } else {
            showAlert("No se ha podido agregar la materia al borrador de horario", "error");
            setTimeout(() => window.location.reload(), 1500);
          }
        })
        .catch((err) => console.error("Error al agregar borrador:", err))
        .finally(() => setAdd(false));
    }
  }, [add]);

  useEffect(() => {
    if (del) {
      fetch(`${API}/EliminarBorrador/${idgru}`, { method: "POST", credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showAlert("Se ha eliminado la materia de tu borrador de horario", "success");
            setTimeout(() => window.location.reload(), 1500);
          } else {
            showAlert("No se ha podido eliminar la materia del borrador de horario", "error");
            setTimeout(() => window.location.reload(), 1500);
          }
        })
        .catch((err) => console.error("Error al eliminar borrador:", err))
        .finally(() => setdel(false));

    }
  }, [del]);

// Datos paginados
const totalPaginas = Math.max(
  1,
  Math.ceil(datosFiltrados.length / resultadosPorPagina)
);

const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
const datosPagina = datosFiltrados.slice(
  indiceInicio,
  indiceInicio + resultadosPorPagina
);




// Cambiar página
const siguientePagina = () => {
  if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
};

const anteriorPagina = () => {
  if (paginaActual > 1) setPaginaActual(paginaActual - 1);
};

// Si cambian los datos, regresar a página 1
useEffect(() => {
  setPaginaActual(1);
}, [filtroMateria, filtroProfesor, filtroTurno, filtroCarrera]);


const carrerasDisponibles = [
  ...new Set(
    datos
      .map(d => d.Unidad_Aprendizaje?.carrera)
      .filter(Boolean)
  )
];


  return (
    <div className="alumno-container">
    <section>
      <SidebarAlumno />
    <main className="main-content">
      <header className="chat-header">
          <div className="encabezado-section">
          <h1>HORARIOS</h1>
            
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>

      
      <section className="gestion-alumnos">
        <div className="filtros-horarios" style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
  <input
    type="text"
    placeholder="Buscar materia..."
    value={filtroMateria}
    onChange={(e) => setFiltroMateria(e.target.value)}
    className="btn-ver"
  />

  <input
    type="text"
    placeholder="Buscar profesor..."
    value={filtroProfesor}
    onChange={(e) => setFiltroProfesor(e.target.value)}
    className="btn-ver"
  />

  <select
    value={filtroTurno}
    onChange={(e) => setFiltroTurno(e.target.value)}
    className="btn-ver"
  >
    <option value="">Todos los turnos</option>
    <option value="Matutino">Matutino</option>
    <option value="Vespertino">Vespertino</option>
  </select>

  <select
  value={filtroCarrera}
  onChange={(e) => setFiltroCarrera(e.target.value)}
  className="btn-ver"
>
  <option value="">Todas las carreras</option>
  {carrerasDisponibles.map((car) => (
    <option key={car} value={car}>
      {car}
    </option>
  ))}
</select>

</div>

      <div style={{ overflowX: "auto" }}>
      <table className="horario-table1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profesor</th>
            <th>Calificación del profesor</th>
            <th>Unidad de Aprendizaje</th>
            <th>Turno</th>
            <th>Carrera</th>
            <th>Cupo</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datosPagina.map((dato) => {
            // Distribuciones pueden venir como array o como objeto único
            const distribsRaw = dato.Distribucion || [];
            const distribs = Array.isArray(distribsRaw) ? distribsRaw : [distribsRaw];

            const horasPorDia = (dia) => {
              if (dia === 'Miércoles') {
                const vals = distribs
                  .filter(d => d && (d.dia === 'Miércoles' || d.dia === 'Miércoles'))
                  .map(d => `${d.hora_ini} - ${d.hora_fin}`);
                return vals.join(', ');
              }
              const vals = distribs
                .filter(d => d && d.dia === dia)
                .map(d => `${d.hora_ini} - ${d.hora_fin}`);
              return vals.join(', ');
            };

            const estaCursada = cursadas.includes(dato.Unidad_Aprendizaje.nombre);
            let carreraValida = false;
            if(dato.Unidad_Aprendizaje.carrera == carrera){
              carreraValida = true;
            }
            return (
              
              <tr key={dato.id}>
                <td>{dato.nombre}</td>
                <td>{dato.DatosPersonale && `${dato.DatosPersonale.nombre || ''} ${dato.DatosPersonale.ape_paterno || ''} ${dato.DatosPersonale.ape_materno || ''}`}</td>
                <th>
                    <div style={{ display: "flex", justifyContent: "center" }} onClick={()=>handleClickResena(dato.DatosPersonale.id)}>
                      <Stars value={(dato.DatosPersonale?.calificacion || 0) / 2} />
                    </div>
                </th>                
                <td>{dato.Unidad_Aprendizaje && dato.Unidad_Aprendizaje.nombre}</td>
                <td>{dato.turno}</td>
                <td>{dato.Unidad_Aprendizaje && dato.Unidad_Aprendizaje.carrera}</td>
                <td>{dato.cupo}</td>
                <td>{horasPorDia('Lunes') || ' '}</td>
                <td>{horasPorDia('Martes') || ' '}</td>
                <td>{horasPorDia('Miércoles') || ' '}</td>
                <td>{horasPorDia('Jueves') || ' '}</td>
                <td>{horasPorDia('Viernes') || ' '}</td>
                <td><button
                      type="button"
                      className="btn azul"
                      onClick={() => handleClickAdd(dato.id)}
                      disabled={
                        borr.some(b => b.id_grupo === dato.id) ||
                        estaCursada || 
                        !carreraValida
                      }
                    >
                      <FiPlus style={{ marginRight: "8px" }} />
                        Agregar al borrador
                    </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      <div className="paginacion">
  <button
    className="btn-ver"
    onClick={anteriorPagina}
    disabled={paginaActual === 1}
  >
     Anterior
  </button>

  <span className="pagina-activa">
     {paginaActual} / {totalPaginas}
  </span>

  <button
    className="btn-ver"
    onClick={siguientePagina}
    disabled={paginaActual === totalPaginas}
  >
    Siguiente 
  </button>
</div>




      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Borrador de horario</h1>
        <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding={5}>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Profesor</th>
              <th>Calificacion del profesor</th>
              <th>Materia</th>
              <th>Cupo</th>
              <th>Creditos Necesarios </th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
              <th>Es valido</th>
              <th>Acciones</th>

            </tr>
          </thead>
          <tbody>
            {borr.length > 0 ? (
              borr.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.Grupo.nombre}</td>
                  <td>{dato.profesor.nombre} {dato.profesor.ape_paterno} {dato.profesor.ape_materno} </td>
                  <td>{dato.calificacion}</td>
                  <td>{dato.materia}</td>
                  <td>{dato.Grupo.cupo}</td>
                  <td>{dato.Grupo.Unidad_Aprendizaje.credito}</td>
                  <td>{dato.horas_lun || " "}</td>
                  <td>{dato.horas_mar || " "}</td>
                  <td>{dato.horas_mie || " "}</td>
                  <td>{dato.horas_jue || " "}</td>
                  <td>{dato.horas_vie || " "}</td>
                  <td>{dato.valido === 1 ? "Es valido" : " No es valido"}</td>
                  <td><button type="button" className="btn azul" onClick={() => handleClickDel(dato.id_grupo)}>
                    Retirar del borrador</button></td>
                </tr>
              ))
            ) : (
              <tr colSpan="12"><td>No hay datos disponibles</td></tr>
            )}
          </tbody>

        </table>
        </div>

      </Modal>

      <Modal open={modalResenas} onClose={() => setModalResenas(false)}>
  <h1>Reseñas del profesor</h1>

  {resenas.length === 0 ? (
    <p>No hay reseñas registradas.</p>
  ) : (
    <div style={{ overflowX: "auto" }}>
    <table className="resenas-table">
      <thead>
        <tr>
          <th>Calificación</th>
          <th>Comentarios</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {resenas.map((r) => (
          <tr key={r.id}>
            <td style={{ textAlign: "center" }}>
              <Stars value={(r.calificacion || 0) / 2} />
            </td>

            <td>
              <div className="resena-comentario">
                {r.comentarios || "Sin comentarios"}
              </div>
            </td>

            <td style={{ textAlign: "center" }}>
              {new Date(r.fecha).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )}
</Modal>

      
     
        
        <div className="download-button">
          <div>
          <button type="button" className="btn azul" onClick={() => setModalOpen(true)}>
        <FiEye style={{ marginRight: "8px" }} />
        Ver borrador
        </button>
        </div>
        <div> 
          
        </div>
        </div>

      </section>
      </main>
    </section>
    
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
