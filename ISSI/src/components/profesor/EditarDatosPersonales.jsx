import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProfeSideBar } from "./ProfeSidebar";
import "./InformacionPersonal.css";

export function EditarDatosPersonales() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "/api1";

  const [form, setForm] = useState({});
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let active = true;

    const cargarDatos = async () => {
      setCargando(true);
      try {
        const res = await fetch(`${API}/ObtenerProfesores`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al obtener profesores");

        const json = await res.json();
        const lista = json.profesores || [];

        const prof = lista.find((p) => String(p.id) === String(id));
        if (!prof) {
          if (active) {
            setForm(null);
            setCargando(false);
          }
          return;
        }

        const normalizado = {
          id: prof.id ?? "",
          nombre: prof.nombre ?? "",
          ape_paterno: prof.ape_paterno ?? "",
          ape_materno: prof.ape_materno ?? "",
          fecha_nacimiento: (prof.fecha_nacimiento ?? "").slice(0, 10),
          tipo_sangre: prof.tipo_sangre ?? "",
          CURP: prof.CURP ?? "",
          nacionalidad: prof.nacionalidad ?? "",

          calle: prof.calle ?? "",
          num_exterior: prof.num_exterior ?? "",
          num_interior: prof.num_interior ?? "",
          codigo_postal: prof.codigo_postal ?? "",
          colonia: prof.colonia ?? "",
          delegacion: prof.delegacion ?? "",
          ciudad: prof.ciudad ?? "",
          telefono: prof.telefono ?? "",

          email: prof.email ?? "",
          rfc: prof.rfc ?? "",
          grado: prof.grado ?? "",
        };

        if (active) {
          setForm(normalizado);
          setCargando(false);
        }
      } catch (error) {
        console.error(error);
        if (active) setCargando(false);
      }
    };

    cargarDatos();
    return () => (active = false);
  }, [id]);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${API}/EditarProfesor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Error al actualizar");

      setMsg("Datos actualizados correctamente");
      setTimeout(() => navigate(`/profesor/informacionPersonal/${id}`), 1000);
    } catch (error) {
      setMsg(error.message);
    }
  };

  const volver = () => navigate(`/profesor/informacionPersonal/${id}`);

  if (cargando) return <div className="loading">Cargando...</div>;
  if (!form.id)
    return (
      <div style={{ padding: 20 }}>No se encontró información del profesor.</div>
    );

  return (
    <div className="admin-container" style={{ padding: 0 }}>
      <ProfeSideBar />

      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>EDITAR DATOS PERSONALES</h1>
          </div>
          <img src="/escom.png" alt="ESCOM" className="escom-logo" />
        </header>

        <section className="gestion-alumnos">
          <header className="alumno-header">
            <div>
              <p>
                Editando: {form.nombre} {form.ape_paterno} {form.ape_materno}
              </p>
              <p>ID Profesor: {form.id}</p>
            </div>
          </header>

          <form onSubmit={onSubmit} className="form-container">
            <div className="formulario">
              <div className="form-grid">

                {/* Información Personal */}
                <div className="form-section">
                  <h3>Información Personal</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input name="nombre" value={form.nombre} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>Apellido Paterno</label>
                      <input name="ape_paterno" value={form.ape_paterno} onChange={onChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Apellido Materno</label>
                      <input name="ape_materno" value={form.ape_materno} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>Fecha de nacimiento</label>
                      <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={onChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo de Sangre</label>
                      <input name="tipo_sangre" value={form.tipo_sangre} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>CURP</label>
                      <input name="CURP" value={form.CURP} onChange={onChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nacionalidad</label>
                      <input name="nacionalidad" value={form.nacionalidad} onChange={onChange} />
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="form-section">
                  <h3>Dirección</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Calle</label>
                      <input name="calle" value={form.calle} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>Número Exterior</label>
                      <input name="num_exterior" value={form.num_exterior} onChange={onChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Número Interior</label>
                      <input name="num_interior" value={form.num_interior} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>Código Postal</label>
                      <input name="codigo_postal" value={form.codigo_postal} onChange={onChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Colonia</label>
                      <input name="colonia" value={form.colonia} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>Delegación</label>
                      <input name="delegacion" value={form.delegacion} onChange={onChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input name="ciudad" value={form.ciudad} onChange={onChange} />
                    </div>

                    <div className="form-group">
                      <label>Teléfono</label>
                      <input name="telefono" value={form.telefono} onChange={onChange} />
                    </div>
                  </div>
                </div>

                {/* Profesional */}
                <div className="form-section">
                  <h3>Información Profesional</h3>

                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input name="email" value={form.email} onChange={onChange} />
                  </div>

                  <div className="form-group">
                    <label>RFC</label>
                    <input name="rfc" value={form.rfc} onChange={onChange} />
                  </div>

                  <div className="form-group">
                    <label>Grado Académico</label>
                    <input name="grado" value={form.grado} onChange={onChange} />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn azul">Guardar cambios</button>
                <button type="button" className="btn blanco" onClick={volver}>Cancelar</button>
              </div>

              {msg && <p className="msg-success">{msg}</p>}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
