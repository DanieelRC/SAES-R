import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarDatosPersonales.css";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

const API = "/api1";

export function EditarDatos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { alertState, showAlert, hideAlert } = useAlert();

  const [alumno, setAlumno] = useState({
    nombre: "",
    ape_paterno: "",
    ape_materno: "",
    fecha_nacimiento: "",
    tipo_sangre: "",
    CURP: "",
    nacionalidad: "",
    calle: "",
    num_exterior: "",
    num_interior: "",
    codigo_postal: "",
    colonia: "",
    delegacion: "",
    ciudad: "",
    telefono: "",
    email: "",
    carrera: "",
  });

  const [datosMedicos, setDatosMedicos] = useState({
    peso: "",
    altura: "",
    tipo_sangre: "",
    nss: "",
  });

  const [enfermedades, setEnfermedades] = useState([]);
  const [loadingDM, setLoadingDM] = useState(false);

  const [showEnfModal, setShowEnfModal] = useState(false);
  const [editEnf, setEditEnf] = useState(null);
  const [descripcionEnf, setDescripcionEnf] = useState("");

  // ====================== CARGA INICIAL ======================
  useEffect(() => {
    fetch(`${API}/ObtenerAlumno/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.alumno && setAlumno(data.alumno))
      .catch(() => showAlert("Error al obtener alumno", "error"));
  }, [id]);

  const cargarDatosMedicos = async () => {
    try {
      setLoadingDM(true);
      const res = await fetch(`${API}/alumno/datosMedicos`, {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.datos) {
        setDatosMedicos({
          peso: data.datos.peso ?? "",
          altura: data.datos.altura ?? "",
          tipo_sangre: data.datos.tipo_sangre ?? "",
          nss: data.datos.nss ?? "",
        });
      }
      setEnfermedades(data.enfermedades || []);
    } catch {
      showAlert("Error al cargar datos médicos", "error");
    } finally {
      setLoadingDM(false);
    }
  };

  useEffect(() => {
    cargarDatosMedicos();
  }, []);

  // ====================== HANDLERS ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDatosMedicos = (e) => {
    const { name, value } = e.target;
    setDatosMedicos((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarDatosMedicos = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/alumno/datosMedicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          peso: datosMedicos.peso ? Number(datosMedicos.peso) : null,
          altura: datosMedicos.altura ? Number(datosMedicos.altura) : null,
          tipo_sangre: datosMedicos.tipo_sangre,
          nss: datosMedicos.nss,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);

      showAlert("Datos médicos guardados correctamente", "success");
      await cargarDatosMedicos();
    } catch (e) {
      showAlert(e.message || "Error al guardar datos médicos", "error");
    }
  };

  // ====================== ENFERMEDADES ======================
  const abrirNuevaEnfermedad = () => {
    setEditEnf(null);
    setDescripcionEnf("");
    setShowEnfModal(true);
  };

  const abrirEditarEnfermedad = (enf) => {
    setEditEnf(enf);
    setDescripcionEnf(enf.descri || "");
    setShowEnfModal(true);
  };

  const cerrarEnfModal = () => {
    setShowEnfModal(false);
    setDescripcionEnf("");
    setEditEnf(null);
  };

  const handleGuardarEnfermedad = async (e) => {
    e.preventDefault();
    try {
      const url = editEnf
        ? `${API}/alumno/datosMedicos/enfermedades/${editEnf.id}`
        : `${API}/alumno/datosMedicos/enfermedades`;

      const res = await fetch(url, {
        method: editEnf ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ descripcion: descripcionEnf }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);

      showAlert(
        editEnf
          ? "Enfermedad actualizada correctamente"
          : "Enfermedad agregada correctamente",
        "success"
      );

      await cargarDatosMedicos();
      cerrarEnfModal();
    } catch (e) {
      showAlert(e.message || "Error al guardar enfermedad", "error");
    }
  };

  const handleEliminarEnfermedad = async (idEnf) => {
    if (!window.confirm("¿Eliminar esta enfermedad?")) return;

    try {
      const res = await fetch(
        `${API}/alumno/datosMedicos/enfermedades/${idEnf}`,
        { method: "DELETE", credentials: "include" }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);

      showAlert("Enfermedad eliminada correctamente", "success");
      await cargarDatosMedicos();
    } catch (e) {
      showAlert(e.message || "Error al eliminar enfermedad", "error");
    }
  };

  // ====================== SUBMIT ALUMNO ======================
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API}/EditarAlumno/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("Alumno editado con éxito", "success");
          navigate(`/alumno/${id}`);
        } else {
          showAlert("Error al editar alumno", "error");
        }
      })
      .catch(() => showAlert("Error al editar alumno", "error"));
  };

  // ====================== JSX ======================
  return (
    <div className="admin-container">
      <SidebarAlumno />
      {/* Contenido principal */}
      <main className="main-content">
        <section className="gestion-alumnos">
          <div className="header-section">
            <h1>Editar Alumno</h1>
          </div>

          <div className="form-container">
            <form className="formulario" onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Información Personal */}
                <div className="form-section">
                  <h3>Información Personal</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        name="nombre"
                        value={alumno.nombre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Paterno *</label>
                      <input
                        type="text"
                        name="ape_paterno"
                        value={alumno.ape_paterno}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Apellido Materno *</label>
                      <input
                        type="text"
                        name="ape_materno"
                        value={alumno.ape_materno}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Nacimiento *</label>
                      <input
                        type="date"
                        name="fecha_nacimiento"
                        value={alumno.fecha_nacimiento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo de Sangre</label>
                      <input
                        type="text"
                        name="tipo_sangre"
                        value={alumno.tipo_sangre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>CURP</label>
                      <input
                        type="text"
                        name="CURP"
                        value={alumno.CURP}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nacionalidad</label>
                      <input
                        type="text"
                        name="nacionalidad"
                        value={alumno.nacionalidad}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="form-section">
                  <h3>Dirección</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Calle</label>
                      <input
                        type="text"
                        name="calle"
                        value={alumno.calle}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Número Exterior</label>
                      <input
                        type="text"
                        name="num_exterior"
                        value={alumno.num_exterior}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Número Interior</label>
                      <input
                        type="text"
                        name="num_interior"
                        value={alumno.num_interior}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        name="codigo_postal"
                        value={alumno.codigo_postal}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Colonia</label>
                      <input
                        type="text"
                        name="colonia"
                        value={alumno.colonia}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Delegación</label>
                      <input
                        type="text"
                        name="delegacion"
                        value={alumno.delegacion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        name="ciudad"
                        value={alumno.ciudad}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={alumno.telefono}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Información Académica */}
                <div className="form-section">
                  <h3>Información Académica</h3>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={alumno.email}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <h3>Carrera</h3>
                  <div className="form-group">
                    <label>Carrera</label>
                    <input
                      type="text"
                      name="email"
                      value={alumno.carrera}
                      readOnly
                    />
                  </div>
                  </div>
                </div>

                {/* -------------------- NUEVA SECCIÓN: DATOS MÉDICOS -------------------- */}
                <div className="form-section">
                  <h3>Datos Médicos</h3>
                  {loadingDM ? (
                    <p>Cargando datos médicos...</p>
                  ) : (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Peso (kg)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="peso"
                            value={datosMedicos.peso}
                            onChange={handleChangeDatosMedicos}
                          />
                        </div>
                        <div className="form-group">
                          <label>Altura (m)</label>
                          <input
                            type="number"
                            step="0.01"
                            name="altura"
                            value={datosMedicos.altura}
                            onChange={handleChangeDatosMedicos}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tipo de sangre (médico)</label>
                          <input
                            type="text"
                            name="tipo_sangre"
                            value={datosMedicos.tipo_sangre}
                            onChange={handleChangeDatosMedicos}
                          />
                        </div>
                        <div className="form-group">
                          <label>NSS</label>
                          <input
                            type="text"
                            name="nss"
                            value={datosMedicos.nss}
                            onChange={handleChangeDatosMedicos}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn azul"
                        onClick={handleGuardarDatosMedicos}
                      >
                        Guardar datos médicos
                      </button>
                    </>
                  )}
                </div>
                {/* ---------------------------------------------------------------------- */}

                {/* -------------------- NUEVA SECCIÓN: ENFERMEDADES --------------------- */}
                <div className="form-section">
                  <div className="form-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <h3>Enfermedades</h3>
                    <button
                      type="button"
                      className="btn azul"
                      onClick={abrirNuevaEnfermedad}
                    >
                      Agregar enfermedad
                    </button>
                  </div>

                  <div className="enfermedades-grid">
                    {enfermedades.length === 0 && (
                      <p>No hay enfermedades registradas.</p>
                    )}

                    {enfermedades.map((enf) => (
                      <div
                        key={enf.id}
                        className="enfermedad-card"
                      >
                        <p>{enf.descri}</p>
                        <div className="enfermedad-actions">
                          <button
                            type="button"
                            className="btn-editar"
                            onClick={() => abrirEditarEnfermedad(enf)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn-eliminar"
                            onClick={() => handleEliminarEnfermedad(enf.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* ---------------------------------------------------------------------- */}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn azul">
                  Editar Alumno
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* ---------------------- MODAL NUEVO: ENFERMEDAD ---------------------------- */}
      {showEnfModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "16px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h5>{editEnf ? "Editar enfermedad" : "Nueva enfermedad"}</h5>
            <form onSubmit={handleGuardarEnfermedad}>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  value={descripcionEnf}
                  onChange={(e) => setDescripcionEnf(e.target.value)}
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={cerrarEnfModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn azul">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ---------------- */}

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
