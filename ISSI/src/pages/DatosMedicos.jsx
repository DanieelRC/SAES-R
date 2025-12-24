// src/pages/DatosMedicos.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";

const API = "/api1";

export function DatosMedicos() {
  // ID del alumno viene de la URL: /administrador/datosMedicos/:id
  const { id } = useParams();
  const navigate = useNavigate();

  const [dm, setDm] = useState(null); // Datos médicos (un solo registro por alumno)
  const [enfs, setEnfs] = useState([]); // Enfermedades
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Modales
  const [modalDM, setModalDM] = useState(false);
  const [modalEnf, setModalEnf] = useState(false);
  const [editEnf, setEditEnf] = useState(null);

  // Formularios
  const [formDM, setFormDM] = useState({
    peso: "",
    altura: "",
    tipo_sangre: "",
    nss: "",
  });
  const [formEnf, setFormEnf] = useState({ descripcion: "" });

  const onChangeDM = (e) =>
    setFormDM({ ...formDM, [e.target.name]: e.target.value });
  const onChangeEnf = (e) =>
    setFormEnf({ ...formEnf, [e.target.name]: e.target.value });

  // Cargar datos médicos + enfermedades del alumno de la URL
  const cargar = async () => {
    if (!id) return;
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/datos-medicos/${encodeURIComponent(id)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudieron obtener los datos médicos");
      }

      setDm(data.datos || null);
      setEnfs(data.enfermedades || []);
    } catch (e) {
      console.error(e);
      setMsg(e.message || "Error al cargar datos médicos");
      setDm(null);
      setEnfs([]);
    } finally {
      setLoading(false);
    }
  };

  // Se carga automáticamente al entrar a la página o si cambia el id
  useEffect(() => {
    cargar();
  }, [id]);

  // Abrir modal para crear datos médicos
  const abrirCrearDM = () => {
    setFormDM({ peso: "", altura: "", tipo_sangre: "", nss: "" });
    setModalDM(true);
  };

  // Abrir modal para editar datos médicos
  const abrirEditarDM = () => {
    if (!dm) return;
    setFormDM({
      peso: dm.peso ?? "",
      altura: dm.altura ?? "",
      tipo_sangre: dm.tipo_sangre ?? "",
      nss: dm.nss ?? "",
    });
    setModalDM(true);
  };

  // Guardar datos médicos (crear o editar)
  const guardarDM = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      let res;

      if (dm) {
        // Actualizar registro existente
        res = await fetch(
          `${API}/api/datos-medicos/${encodeURIComponent(dm.id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              peso: Number(formDM.peso),
              altura: Number(formDM.altura),
              tipo_sangre: formDM.tipo_sangre,
              nss: formDM.nss,
            }),
          }
        );
      } else {
        // Crear nuevo registro usando el id del alumno de la URL
        res = await fetch(`${API}/api/datos-medicos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id_usuario: id,
            peso: Number(formDM.peso),
            altura: Number(formDM.altura),
            tipo_sangre: formDM.tipo_sangre,
            nss: formDM.nss,
          }),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");

      setModalDM(false);
      await cargar();
      setMsg("Datos médicos guardados correctamente");
    } catch (e) {
      console.error(e);
      setMsg(e.message || "Error al guardar datos médicos");
    }
  };

  // Abrir modal para nueva enfermedad
  const abrirNuevaEnf = () => {
    setEditEnf(null);
    setFormEnf({ descripcion: "" });
    setModalEnf(true);
  };

  // Abrir modal para editar enfermedad
  const abrirEditarEnf = (enf) => {
    setEditEnf(enf);
    setFormEnf({ descripcion: enf.descri || "" });
    setModalEnf(true);
  };

  // Guardar enfermedad (crear o editar)
  const guardarEnf = async (e) => {
    e.preventDefault();
    if (!dm) return;
    try {
      let res;

      if (editEnf) {
        res = await fetch(
          `${API}/api/datos-medicos/${encodeURIComponent(
            dm.id
          )}/enfermedades/${encodeURIComponent(editEnf.id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ descripcion: formEnf.descripcion }),
          }
        );
      } else {
        res = await fetch(
          `${API}/api/datos-medicos/${encodeURIComponent(
            dm.id
          )}/enfermedades`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ descripcion: formEnf.descripcion }),
          }
        );
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");

      setModalEnf(false);
      await cargar();
      setMsg("Enfermedad guardada correctamente");
    } catch (e) {
      console.error(e);
      setMsg(e.message || "Error al guardar enfermedad");
    }
  };

  // Eliminar enfermedad
  const eliminarEnf = async (enf) => {
    if (!dm) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta enfermedad?")) return;
    try {
      const res = await fetch(
        `${API}/api/datos-medicos/${encodeURIComponent(
          dm.id
        )}/enfermedades/${encodeURIComponent(enf.id)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar");

      await cargar();
    } catch (e) {
      console.error(e);
      setMsg(e.message || "Error al eliminar enfermedad");
    }
  };

  return (
  <div className="admin-container">
    <AdminSidebar />

    <main className="main-content">
      <header className="chat-header">
        <div className="encabezado-section">
          <h1>Datos Médicos del alumno</h1>
        </div>
        <p className="subtitulo-carreras">
          Revisa la información médica del alumno
        </p>
        <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <section className="carreras-section">
        <div className="carreras-card">

          {/* Mensajes */}
          {msg && <p className="mensaje-carreras">{msg}</p>}

          {/* Botón volver */}
          <div className="carreras-header-row" style={{ marginBottom: 8 }}>
            <div> 
            <button className="btn blanco" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            </div>
          </div>

          <h2>Datos médicos del alumno</h2>
          <p>
            <strong>Boleta:</strong> {id}
          </p>

          {loading && <p className="texto-cargando">Cargando...</p>}

          {/* SI NO EXISTEN DATOS MÉDICOS */}
          {!dm ? (
            <>
              <p>No hay datos médicos registrados para este alumno.</p>
              <button
                className="btn azul"
                onClick={abrirCrearDM}
                disabled={!id}
              >
                Crear datos médicos
              </button>
            </>
          ) : (
            <>
              {/* CARD DE DATOS MÉDICOS */}
              <div className="carreras-card" style={{ marginTop: 12 }}>
                <h3>Datos médicos</h3>

                <div className="fila-dato">
                  <strong>ID registro:</strong> {dm.id}
                </div>
                <div className="fila-dato">
                  <strong>Peso:</strong> {dm.peso} kg
                </div>
                <div className="fila-dato">
                  <strong>Altura:</strong> {dm.altura} m
                </div>
                <div className="fila-dato">
                  <strong>Tipo de sangre:</strong> {dm.tipo_sangre}
                </div>
                <div className="fila-dato">
                  <strong>NSS:</strong> {dm.nss}
                </div>

                <button className="btn azul" onClick={abrirEditarDM} style={{ marginTop: 8 }}>
                  Editar datos médicos
                </button>
              </div>

              {/* ENFERMEDADES */}
              <div className="carreras-header-row" style={{ marginTop: 18 }}>
                <h3>Enfermedades</h3>
                <button className="btn-nueva-carrera" onClick={abrirNuevaEnf}>
                  + Agregar enfermedad
                </button>
              </div>

              {/* LISTA ESTILIZADA */}
              <div className="tabla-wrapper">
                <table className="tabla-carreras">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {enfs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="sin-registros">
                          Sin enfermedades registradas.
                        </td>
                      </tr>
                    )}

                    {enfs.map((e) => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.descri}</td>
                        <td className="acciones-col">
                          <button className="btn azul" onClick={() => abrirEditarEnf(e)}>
                            Editar
                          </button>
                          <button className="btn blanco" onClick={() => eliminarEnf(e)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </main>

    {/* =========== MODAL DATOS MÉDICOS (ESTILO ETS) ============= */}
    {modalDM && (
      <div className="modal-overlay">
        <div className="modal-card">
          <h3>{dm ? "Editar datos médicos" : "Crear datos médicos"}</h3>

          <form className="modal-form" onSubmit={guardarDM}>
            <input
              name="peso"
              type="number"
              step="0.1"
              placeholder="Peso (kg)"
              value={formDM.peso}
              onChange={onChangeDM}
              required
            />

            <input
              name="altura"
              type="number"
              step="0.01"
              placeholder="Altura (m)"
              value={formDM.altura}
              onChange={onChangeDM}
              required
            />

            <input
              name="tipo_sangre"
              placeholder="Tipo de sangre (Ej: O+)"
              value={formDM.tipo_sangre}
              onChange={onChangeDM}
              required
            />

            <input
              name="nss"
              placeholder="NSS"
              value={formDM.nss}
              onChange={onChangeDM}
              required
            />

            <div className="modal-actions">
              <button type="submit" className="btn azul">
                Guardar
              </button>
              <button
                type="button"
                className="btn blanco"
                onClick={() => setModalDM(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* =========== MODAL ENFERMEDAD (ESTILO ETS) ============= */}
    {modalEnf && (
      <div className="modal-overlay">
        <div className="modal-card">
          <h3>{editEnf ? "Editar enfermedad" : "Nueva enfermedad"}</h3>

          <form className="modal-form" onSubmit={guardarEnf}>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formEnf.descripcion}
              onChange={onChangeEnf}
              required
            />

            <div className="modal-actions">
              <button type="submit" className="btn azul">
                Guardar
              </button>
              <button
                type="button"
                className="btn blanco"
                onClick={() => setModalEnf(false)}
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


const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const modal = {
  background: "#fff",
  padding: 16,
  maxWidth: 520,
  width: "100%",
  borderRadius: 8,
};
