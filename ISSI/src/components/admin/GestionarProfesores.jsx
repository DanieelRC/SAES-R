import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GestionarProfesores.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function GestionarProfesores() {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 5;

  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]);
  const [id_profesor, setId_profesor] = useState("");
  const [del, setDelete] = useState(false);
  const [mostrarModal, setmostrarModal] = useState(false);

  const { alertState, showAlert, hideAlert } = useAlert();

  const handleRegistrarProf = () => navigate("registrarProfesor");
  const handleClickEdit = (id) => navigate(`editarProfesor/${id}`);

  const handleAbrirModal = (id) => {
    setmostrarModal(true);
    setId_profesor(id);
  };

  const handleCerrarModal = () => setmostrarModal(false);

  useEffect(() => {
    fetch("/api1/ObtenerProfesores", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProfesores(data.profesores || []))
      .catch((err) =>
        console.error("Error al obtener los profesores:", err)
      );
  }, []);

  useEffect(() => {
    if (del) {
      fetch(`/api1/EliminarProfesor/${id_profesor}`, {
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showAlert("Profesor eliminado correctamente", "success");
            setProfesores((prev) =>
              prev.filter((p) => p.id !== id_profesor)
            );
            setmostrarModal(false);
          } else {
            showAlert("Error al eliminar el profesor", "error");
          }
        })
        .catch((err) =>
          console.error("Error al eliminar el profesor:", err)
        );
      setDelete(false);
    }
  }, [del, id_profesor, showAlert]);

  // 🔍 FILTRO
  const profesoresFiltrados = profesores.filter((prof) => {
    const nombreCompleto = `${prof.nombre} ${prof.ape_paterno} ${prof.ape_materno}`.toLowerCase();
    return (
      nombreCompleto.includes(busqueda.toLowerCase()) ||
      prof.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.id.toString().includes(busqueda)
    );
  });

  // 🔄 RESET PAGINA AL BUSCAR
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // 📄 PAGINADO
  const totalPaginas = Math.ceil(
    profesoresFiltrados.length / ITEMS_POR_PAGINA
  );

  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const indiceFin = indiceInicio + ITEMS_POR_PAGINA;

  const profesoresPaginados = profesoresFiltrados.slice(
    indiceInicio,
    indiceFin
  );

  return (
    <div className="gp-layout">
      <AdminSidebar />

      <main className="gp-main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Gestión de Profesores</h1>
          </div>

          <button className="btn azul" onClick={handleRegistrarProf}>
            + Registrar nuevo profesor
          </button>

          <img
            src="/escom.png"
            alt="Logo ESCOM"
            className="header-logo"
          />
        </header>

        <div className="tabla-contenedor">
          <div className="tabla-header">
            <h2>Lista de Profesores</h2>

            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar profesor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn-buscar">🔎</button>
            </div>
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo Institucional</th>
                <th>Grado</th>
                <th>Situación</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {profesoresPaginados.length > 0 ? (
                profesoresPaginados.map((profesor) => (
                  <tr key={profesor.id}>
                    <td>{profesor.id}</td>
                    <td>
                      {profesor.nombre} {profesor.ape_paterno}{" "}
                      {profesor.ape_materno}
                    </td>
                    <td>{profesor.email}</td>
                    <td>{profesor.grado}</td>
                    <td>{profesor.situacion}</td>
                    <td>
                      <button
                        className="icono editar"
                        onClick={() =>
                          handleClickEdit(profesor.id)
                        }
                      >
                        ✎
                      </button>

                      <button
                        className="icono eliminar"
                        onClick={() =>
                          handleAbrirModal(profesor.id)
                        }
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No se encontraron profesores</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="tabla-footer">
            <button className="btn azul">
              Descargar Listado
            </button>

            <div className="paginacion">
              <button
                disabled={paginaActual === 1}
                onClick={() =>
                  setPaginaActual((p) => p - 1)
                }
              >
                Anterior
              </button>

              <span className="pagina-activa">
                {paginaActual} / {totalPaginas || 1}
              </span>

              <button
                disabled={
                  paginaActual === totalPaginas ||
                  totalPaginas === 0
                }
                onClick={() =>
                  setPaginaActual((p) => p + 1)
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="gp-modal-overlay">
          <div className="gp-modal">
            <h3>¿Estás seguro?</h3>
            <p>Esta acción no se puede deshacer.</p>

            <div className="modal-botones">
              <button
                className="btn rojo"
                onClick={() => setDelete(true)}
              >
                Confirmar
              </button>
              <button
                className="btn gris"
                onClick={handleCerrarModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
}