import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GestionarAlumnos.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";
import { FaEdit, FaBookOpen, FaTrash, FaBookMedical } from "react-icons/fa";
import { MdMedicalInformation } from "react-icons/md";


export function GestionarAlumnos() {

  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [datos, setDatos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idAlumno, setIdAlumno] = useState("");
  const [del, setDelete] = useState(false);

  const [busqueda, setBusqueda] = useState("");

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const navigate = useNavigate();
  const API = "/api1";

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const alumnosPorPagina = 5;

  
  // NUEVO: ir a la vista de inscripción admin para un alumno
  const handleClickInscribir = (id) =>
    navigate(`/administrador/gestionarAlumnos/inscripcion/${id}`);
  const handleClickAlu = () => navigate("../administrador/gestionarAlumnos");
  const handleClickProf = () => navigate("../administrador/gestionarProfesores");
  const handleClickCursos = () => navigate("../administrador/gestionarCursos");
  const handleRegistrar = () => navigate("registrarAlumno");

  const handleClickEdit = (id) => { 
    navigate(`/administrador/gestionarAlumnos/editarAlumnos/${id}`);
  };

  const handleAbrirModal = (id) => {
    setMostrarModal(true);
    setIdAlumno(id);
  };

  const handleCerrarModal = () => setMostrarModal(false);

  const handleEliminar = () => setDelete(true);

  // NUEVO → Navegar a Datos Médicos y Enfermedades
  const handleVerDatosMedicos = (idAlumno) => {
    navigate(`/administrador/datosMedicos/${idAlumno}`);
  };

  // Obtener alumnos
  useEffect(() => {
    fetch(`${API}/ObtenerAlumnos`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDatos(data.alumnos || []))
      .catch(() => setDatos([]));
  }, []);

  // Cargar carreras
  useEffect(() => {
    fetch(`${API}/ObtenerCarreras`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCarreras(data.carreras || []))
      .catch((err) => console.error("Error al obtener las carreras:", err));
  }, []);

  // Eliminar alumno (ponerlo inactivo)
  useEffect(() => {
    if (del) {
      fetch(`${API}/EliminarAlumno/${idAlumno}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showAlert("Alumno eliminado correctamente", "success");
            setDatos((prev) => prev.filter((a) => a.id !== idAlumno));
          } else {
            showAlert("Error al eliminar el alumno", "error");
          }
          setMostrarModal(false);
        });

      setDelete(false);
    }
  }, [del, idAlumno]);

  // Filtrado y búsqueda
  const alumnosFiltrados = datos.filter((a) => {
    const nombreCompleto = `${a.nombre || ""} ${a.ape_paterno || ""} ${
      a.ape_materno || ""
    }`.toLowerCase();
    const busq = busqueda.toLowerCase().trim();

    const coincideCarrera = carreraSeleccionada
      ? (a.carrera || "").toLowerCase() === carreraSeleccionada.toLowerCase()
      : true;

    const coincideBusqueda =
      nombreCompleto.includes(busq) ||
      (a.id?.toString() || "").includes(busq) ||
      (a.email?.toLowerCase() || "").includes(busq);

    return coincideCarrera && coincideBusqueda;
  });

  // Paginación
  const totalPaginas = Math.max(
    1,
    Math.ceil(alumnosFiltrados.length / alumnosPorPagina)
  );
  const indiceInicio = (paginaActual - 1) * alumnosPorPagina;
  const alumnosPagina = alumnosFiltrados.slice(
    indiceInicio,
    indiceInicio + alumnosPorPagina
  );

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const anteriorPagina = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, carreraSeleccionada]);

  return (
    <div className="ga-layout">
      <AdminSidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="contenido">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Gestión de Estudiantes</h1>
          </div>
          <div>
            <button className="btn azul" onClick={handleRegistrar}>
              + Registrar nuevo estudiante
            </button>
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>

        {/* FILTROS */}
        <div className="filtros">
          <label>
            Carrera:
            <select
              value={carreraSeleccionada}
              onChange={(e) => setCarreraSeleccionada(e.target.value)}
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((c) => (
                <option key={c.id || c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* TABLA */}
        <div className="tabla-contenedor">
          <div className="tabla-header">
            <h2>Lista de Estudiantes</h2>

            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn-buscar" title="Buscar">
                🔎
              </button>
            </div>
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>Boleta</th>
                <th>Nombre Completo</th>
                <th>Carrera</th>
                <th>Correo Institucional</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {alumnosPagina.length > 0 ? (
                alumnosPagina.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>
                      {a.nombre} {a.ape_paterno} {a.ape_materno}
                    </td>
                    <td>{a.carrera}</td>
                    <td>{a.email}</td>
                    <td className="acciones">

  {/* Editar */}
  <button
    className="icono editar"
    title="Editar alumno"
    onClick={() => handleClickEdit(a.id)}
  >
    <FaEdit />
  </button>

  {/* Eliminar */}
  <button
    className="icono eliminar"
    title="Eliminar alumno"
    onClick={() => handleAbrirModal(a.id)}
  >
    <FaTrash />
  </button>

  {/* Inscripción */}
  <button
    className="icono inscribir"
    title="Inscribir / dar de baja materias"
    onClick={() => handleClickInscribir(a.id)}
  >
    <FaBookOpen />
  </button>

  {/* Datos médicos */}
  <button
    className="icono medico"
    title="Datos médicos"
    onClick={() => handleVerDatosMedicos(a.id)}
  >
    <MdMedicalInformation />
  </button>

</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay alumnos disponibles</td>
                </tr>
              )}
            </tbody>

          </table>

          <div className="tabla-footer">
            <div className="paginacion">
              <button onClick={anteriorPagina} disabled={paginaActual === 1}>
                Anterior
              </button>

              <span className="pagina-activa">
                {paginaActual} / {totalPaginas}
              </span>

              <button
                onClick={siguientePagina}
                disabled={paginaActual >= totalPaginas}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

      </main>
      
      {/* MODAL ELIMINAR */}
      {mostrarModal && (
          <div className="ga-modal-overlay">
            <div className="ga-modal">
              <h3>¿Estás seguro?</h3>
              <p>Esta acción no se puede deshacer.</p>
              <div className="modal-botones">
                <button className="btn rojo" onClick={handleEliminar}>
                  Confirmar
                </button>
                <button className="btn gris" onClick={handleCerrarModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

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


