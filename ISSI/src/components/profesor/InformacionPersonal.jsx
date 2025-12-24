import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { ProfesorLayout } from "./ProfesorLayout";
import "./InformacionPersonal.css"; // REUTILIZA TU CSS

import { ProfeSideBar } from "./ProfeSidebar";

export function InformacionPersonal() {
  const { id } = useParams();
  const navigate = useNavigate();
const API = "/api1";
  const [datos, setDatos] = useState(null); // datos normalizados para render
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfesor = async () => {
      setCargando(true);
      try {
        // usamos la ruta que SI FUNCIONA (lista de profesores) y buscamos el id
        const res = await fetch(`${API}/ObtenerProfesores`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al obtener profesores");

        const json = await res.json();
        const lista = json.profesores || [];

        // buscar el profesor por id (tolerante a mayúsculas/minúsculas)
        const prof = lista.find((p) => String(p.id) === String(id));

        if (!prof) {
          console.warn("No se encontró profesor con id", id);
          if (mounted) {
            setDatos(null);
            setCargando(false);
          }
          return;
        }

        // normalizar campos: intenta varias variantes de nombres que pueda devolver el backend
        const infoNormalizada = {
          id: prof.id ?? prof.ID ?? prof.id_profesor ?? "",
          nombre:
            prof.nombre ??
            prof.nombre_profesor ??
            prof.firstName ??
            prof.first_name ??
            "",
          ape_paterno:
            prof.ape_paterno ??
            prof.apellidoPaterno ??
            prof.apellido_paterno ??
            prof.lastName ??
            "",
          ape_materno:
            prof.ape_materno ??
            prof.apellidoMaterno ??
            prof.apellido_materno ??
            "",
          fecha_nacimiento:
            (prof.fecha_nacimiento ?? prof.birthdate ?? prof.fecha ?? "")?.slice(
              0,
              10
            ) || "",
          tipo_sangre: prof.tipo_sangre ?? prof.tipoSangre ?? "",
          CURP: prof.CURP ?? prof.curp ?? prof.curp_value ?? "",
          nacionalidad: prof.nacionalidad ?? prof.nacionality ?? "",
          // dirección
          calle: prof.calle ?? prof.street ?? "",
          num_exterior: prof.num_ext ?? prof.num_exterior ?? prof.numExterior ?? "",
          num_interior: prof.num_int ?? prof.num_interior ?? prof.numInterior ?? "",
          codigo_postal: prof.cp ?? prof.codigo_postal ?? prof.codigoPostal ?? "",
          colonia: prof.colonia ?? "",
          delegacion: prof.delegacion ?? "",
          ciudad: prof.ciudad ?? prof.city ?? "",
          telefono: prof.telefono ?? prof.phone ?? "",
          // info profesional
          email: prof.email ?? prof.correo ?? "",
          rfc: prof.rfc ?? "",
          grado: prof.grado ?? prof.grado_academico ?? "",
          foto: prof.foto ?? prof.imagen ?? "",
        };

        if (mounted) {
          setDatos(infoNormalizada);
          setCargando(false);
        }
      } catch (err) {
        console.error("Error al cargar profesor:", err);
        if (mounted) {
          setDatos(null);
          setCargando(false);
        }
      }
    };

    fetchProfesor();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEdit = () => navigate(`/profesor/editarDatosPersonales/${id}`);
  const handleLogout = () => navigate(`/`);
  const handleCursos = () => navigate(`/profesor/${id}`);

  if (cargando) return <div className="loading">Cargando datos...</div>;
  if (!datos)
    return (
      <ProfesorLayout profesorId={id}>
        <div style={{ padding: 20 }}>No se encontró la información del profesor.</div>
      </ProfesorLayout>
    );

  return (
    

        <div className="admin-container" style={{ padding: 0 }}>
          {/* Sidebar (simplificado, mantiene tu estructura) */}
       <ProfeSideBar />

          {/* Contenido */}
          <main className="main-content">
            <header className="chat-header">
              <div className="encabezado-section">
                <h1>DATOS PERSONALES DEL PROFESOR</h1>
              </div>
              <img src="/escom.png" alt="ESCOM" className="escom-logo" />
            </header>

            <section className="gestion-alumnos">
              <header className="alumno-header">
                <div>
                  <p>
                    {datos.nombre} {datos.ape_paterno} {datos.ape_materno}
                  </p>
                  <p>ID Profesor: {datos.id}</p>
                </div>
              </header>

              <div className="form-container">
                <div className="formulario">
                  <div className="form-grid">
                    {/* Información Personal */}
                    <div className="form-section">
                      <h3>Información Personal</h3>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Nombre</label>
                          <p>{datos.nombre}</p>
                        </div>
                        <div className="form-group">
                          <label>Apellido Paterno</label>
                          <p>{datos.ape_paterno}</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Apellido Materno</label>
                          <p>{datos.ape_materno}</p>
                        </div>
                        <div className="form-group">
                          <label>Fecha de Nacimiento</label>
                          <p>{datos.fecha_nacimiento}</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Tipo de Sangre</label>
                          <p>{datos.tipo_sangre}</p>
                        </div>
                        <div className="form-group">
                          <label>CURP</label>
                          <p>{datos.CURP}</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Nacionalidad</label>
                          <p>{datos.nacionalidad}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="form-section">
                      <h3>Dirección</h3>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Calle</label>
                          <p>{datos.calle}</p>
                        </div>
                        <div className="form-group">
                          <label>Número Exterior</label>
                          <p>{datos.num_exterior}</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Número Interior</label>
                          <p>{datos.num_interior}</p>
                        </div>
                        <div className="form-group">
                          <label>Código Postal</label>
                          <p>{datos.codigo_postal}</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Colonia</label>
                          <p>{datos.colonia}</p>
                        </div>
                        <div className="form-group">
                          <label>Delegación</label>
                          <p>{datos.delegacion}</p>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Ciudad</label>
                          <p>{datos.ciudad}</p>
                        </div>
                        <div className="form-group">
                          <label>Teléfono</label>
                          <p>{datos.telefono}</p>
                        </div>
                      </div>
                    </div>

                    {/* Información Profesional */}
                    <div className="form-section">
                      <h3>Información Profesional</h3>

                      <div className="form-group">
                        <label>Correo Electrónico</label>
                        <p>{datos.email}</p>
                      </div>

                      <div className="form-group">
                        <label>RFC</label>
                        <p>{datos.rfc}</p>
                      </div>

                      <div className="form-group">
                        <label>Grado Académico</label>
                        <p>{datos.grado}</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn azul" onClick={handleEdit}>
                      <FiEdit2 style={{ marginRight: "8px" }} />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      
    
   
  );
}
