// src/pages/Carreras.jsx
import React, { useEffect, useState } from "react";
import "./Carreras.css";
import { AdminSidebar } from "../components/admin/AdminSidebar.jsx";


const API = "/api1";

export function Carreras() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNombre, setEditNombre] = useState(null); // PK
  const [form, setForm] = useState({
    nombre: "",
    creditos_iniciales: "",
    prefijo_grupo: "",
    duracion_max: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/carreras`, {
        credentials: "include",
      });
      setList(await res.json());
    } catch (e) {
      setMsg("Error cargando carreras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditNombre(null);
    setForm({
      nombre: "",
      creditos_iniciales: "",
      prefijo_grupo: "",
      duracion_max: "",
    });
    setModalOpen(true);
    setMsg("");
  };

  const openEdit = (c) => {
    setEditNombre(c.nombre);
    setForm({
      nombre: c.nombre ?? "",
      creditos_iniciales: c.creditos_iniciales ?? "",
      prefijo_grupo: c.prefijo_grupo ?? "",
      duracion_max: c.duracion_max ?? "",
    });
    setModalOpen(true);
    setMsg("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setMsg("");
  };

  const onChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (editNombre) {
        const res = await fetch(
          `${API}/api/carreras/${encodeURIComponent(editNombre)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              creditos_iniciales: Number(form.creditos_iniciales),
              prefijo_grupo: form.prefijo_grupo,
              duracion_max: Number(form.duracion_max),
            }),
          }
        );
        if (!res.ok) throw new Error("No se pudo actualizar");
      } else {
        const res = await fetch(`${API}/api/carreras`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nombre: form.nombre,
            creditos_iniciales: Number(form.creditos_iniciales),
            prefijo_grupo: form.prefijo_grupo,
            duracion_max: Number(form.duracion_max),
          }),
        });
        if (!res.ok) throw new Error("No se pudo crear");
      }
      await load();
      setMsg(editNombre ? "Carrera actualizada" : "Carrera creada");
      setModalOpen(false);
    } catch (e) {
      setMsg("Error al guardar");
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar fijo, mismo que en Administrador */}
      <AdminSidebar />

      {/* Contenido principal */}
      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Gestión de Carreras</h1>
            
          </div>
          <p className="subtitulo-carreras">
              Administra las carreras ofrecidas por la institución.
            </p>
          <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
        </header>

        <section className="carreras-section">
          <div className="carreras-card">
            {msg && <p className="mensaje-carreras">{msg}</p>}

            <div className="carreras-header-row">
              <h2>Listado de Carreras</h2>
              <button className="btn-nueva-carrera" onClick={openCreate}>
                + Nueva carrera
              </button>
            </div>

            {loading ? (
              <p className="texto-cargando">Cargando...</p>
            ) : (
              <div className="tabla-wrapper">
                <table className="tabla-carreras">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Créditos iniciales</th>
                      <th>Prefijo grupo</th>
                      <th>Duración máx (semestres)</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.nombre}>
                        <td>{c.nombre}</td>
                        <td>{c.creditos_iniciales}</td>
                        <td>{c.prefijo_grupo}</td>
                        <td>{c.duracion_max}</td>
                        <td className="acciones-col">
                          <button
                            className="btn azul"
                            onClick={() => openEdit(c)}
                          >
                            Editar
                          </button>
                          {/* Sin eliminar, como en tu código original */}
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && (
                      <tr>
                        <td colSpan={5} className="sin-registros">
                          Sin registros
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editNombre ? "Editar carrera" : "Nueva carrera"}</h3>

            <form className="modal-form" onSubmit={onSubmit}>
              <input
                name="nombre"
                placeholder="Nombre (PK)"
                value={form.nombre}
                onChange={onChange}
                required
                disabled={!!editNombre}
              />
              <input
                name="creditos_iniciales"
                type="number"
                placeholder="Créditos iniciales"
                value={form.creditos_iniciales}
                onChange={onChange}
                required
              />
              <input
                name="prefijo_grupo"
                placeholder="Prefijo de grupo (ej. ISC)"
                value={form.prefijo_grupo}
                onChange={onChange}
                required
              />
              <input
                name="duracion_max"
                type="number"
                placeholder="Duración máx (semestres)"
                value={form.duracion_max}
                onChange={onChange}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn azul">
                  {editNombre ? "Guardar cambios" : "Crear"}
                </button>
                <button
                  type="button"
                  className="btn blanco"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
