import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GestionarCursos.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function GestionarCursos() {
  const [datos, setDatos] = useState([]);
  const [id_datos, setId_datos] = useState("");
  const [del, setDelete] = useState(false);
  const [mostrarModal, setmostrarModal] = useState(false);

  // filtros
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [turno, setTurno] = useState("");

  // paginación
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const navigate = useNavigate();
  const { alertState, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    fetch("/api1/ObtenerCursos", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDatos(data.cursos))
      .catch((err) => console.error("Error al obtener los cursos:", err));
  }, []);

  useEffect(() => {
    if (!del) return;

    fetch(`/api1/EliminarCurso/${id_datos}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("Grupo eliminado correctamente", "success");
          setmostrarModal(false);
          setDatos((prev) => prev.filter((d) => d.id !== id_datos));
        } else {
          showAlert("Error al eliminar el grupo", "error");
        }
      })
      .catch((err) => console.error("Error al eliminar el grupo:", err));

    setDelete(false);
  }, [del, id_datos]);

  const datosFiltrados = datos.filter((d) => {
    const texto =
      `${d.nombre} ${d.salon} ${d.turno} ${d.Unidad_Aprendizaje?.nombre} ${d.Unidad_Aprendizaje?.carrera} ${d.DatosPersonale?.nombre}`
        .toLowerCase();

    const cumpleTexto = texto.includes(search.toLowerCase());
    const cumpleTipo = tipo ? d.Unidad_Aprendizaje?.tipo === tipo : true;
    const cumpleTurno = turno ? d.turno === turno : true;

    return cumpleTexto && cumpleTipo && cumpleTurno;
  });

  const totalPages = Math.ceil(datosFiltrados.length / PAGE_SIZE);

  const datosPaginados = datosFiltrados.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Gestionar Cursos</h1>
          </div>

          <button className="btn azul" onClick={() => navigate("registrarCurso")}>
            + Registrar Grupo
          </button>

          <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
        </header>

        {/* FILTROS */}
        <div className="gc-filters">
          <input
            type="text"
            placeholder="Buscar por grupo, UA, profesor, carrera…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los tipos</option>
            <option value="Obligatoria">Obligatoria</option>
            <option value="Optativa">Optativa</option>
          </select>

          <select
            value={turno}
            onChange={(e) => {
              setTurno(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los turnos</option>
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
          </select>
        </div>

        {/* TABLA */}
        <div className="gc-card">
          <div className="gc-table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Profesor</th>
                  <th>Salón</th>
                  <th>Unidad de Aprendizaje</th>
                  <th>Tipo</th>
                  <th>Turno</th>
                  <th>Carrera</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {datosPaginados.map((dato) => (
                  <tr key={dato.id}>
                    <td>{dato.nombre}</td>
                    <td>
                      {dato.DatosPersonale.nombre}{" "}
                      {dato.DatosPersonale.ape_paterno}{" "}
                      {dato.DatosPersonale.ape_materno}
                    </td>
                    <td>{dato.salon}</td>
                    <td>{dato.Unidad_Aprendizaje.nombre}</td>
                    <td>{dato.Unidad_Aprendizaje.tipo}</td>
                    <td>{dato.turno}</td>
                    <td>{dato.Unidad_Aprendizaje.carrera}</td>
                    <td className="gc-actions-cell">
                      <button
                        className="btn azul"
                        onClick={() => navigate(`editarCurso/${dato.id}`)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn azul"
                        onClick={() => {
                          setmostrarModal(true);
                          setId_datos(dato.id);
                        }}
                      >
                        Eliminar
                      </button>

                      <button
                        className="btn blanco"
                        onClick={() =>
                          navigate(`distribucionHorarios/${dato.id}`)
                        }
                      >
                        Gestionar distribución
                      </button>
                    </td>
                  </tr>
                ))}

                {datosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="gc-empty">
                      No hay resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="gc-pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀
            </button>

            <span>
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              ▶
            </button>
          </div>
        )}
      </main>

      {/* MODAL CONFIRMAR */}
      {mostrarModal && (
        <div className="gc-modal-backdrop">
          <div className="gc-modal">
            <h3 className="gc-modal-title">¿Estás seguro?</h3>
            <p className="gc-modal-text">
              Esta acción no se puede deshacer. El grupo será eliminado
              permanentemente.
            </p>

            <div className="gc-modal-actions">
              <button className="btn azul" onClick={() => setDelete(true)}>
                Confirmar
              </button>
              <button
                className="btn blanco"
                onClick={() => setmostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTAS */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
}