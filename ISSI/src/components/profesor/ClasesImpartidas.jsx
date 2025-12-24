// Componente combinado: diseño del primero + funcionalidad del segundo
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ClasesImpartidas.css";
import "./Profesor.css";
import { ProfesorLayout } from "./ProfesorLayout";
import { ProfeSideBar } from "./ProfeSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";
const FILAS_POR_PAGINA = 10;

export function ClasesImpartidas({ profesorId: propProfesorId, onClose }) {
  const params = useParams();
  const [datos, setDatos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [periodo, setPeriodo] = useState("");
  const [tiempo, setTiempo] = useState(false);

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const navigate = useNavigate();
  const API = "/api1";

  const profesorId = propProfesorId || params.id;

  const handleClickLista = (id) => {
    navigate(`/profesor/PaseLista/${id}`);
  };

  const handleClickRegistrar = (id) => {
    navigate(`/profesor/RegistrarCalificaciones/${id}/${periodo}`);
  };

  // Obtener tiempo de calificaciones
  useEffect(() => {
    fetch(`${API}/TiempoCalificaciones`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.tiempo) {
          setTiempo(true);
          setPeriodo(data.periodo);
        } else {
          setTiempo(false);
          setPeriodo("");
        }
      })
      .catch(() => {
        setTiempo(false);
        setPeriodo("");
      });
  }, []);

  // Obtener cursos del profesor + horarios
  useEffect(() => {
    console.log("profesorId:", profesorId); // Debug: verificar el ID
    
    if (!profesorId) {
      console.error("No hay profesorId disponible");
      return;
    }

    fetch(`${API}/ObtenerCursos/Prof/${profesorId}`, {
      credentials: "include",
    })
      .then((res) => {
        console.log("Status de respuesta:", res.status); // Debug
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(async (data) => {
        console.log("Respuesta de cursos:", data); // Debug
        
        if (!data || !data.cursos) {
          console.error("Respuesta inválida del servidor:", data);
          setDatos([]);
          return;
        }
        
        const cursos = Array.isArray(data.cursos) ? data.cursos : [];

        const cursosConDist = await Promise.all(
          cursos.map(async (c) => {
            try {
              const resDist = await fetch(`${API}/ObtenerDist/${c.id}`, {
                credentials: "include",
              });
              const d = await resDist.json();
              c.Distribucion = Array.isArray(d?.Distri) ? d.Distri : [];
            } catch (e) {
              console.error("Error al obtener distribución:", e);
              c.Distribucion = [];
            }
            return c;
          })
        );

        setDatos(cursosConDist);
      })
      .catch((err) => {
        console.error("Error al obtener cursos:", err);
        showAlert(`Error al cargar los cursos: ${err.message}\nRevisa la consola para más detalles.`, "error");
        setDatos([]);
      });
  }, [profesorId]);

  // Validar página actual
  useEffect(() => {
    const filtrados = datos.filter((d) => String(d.id_prof) === String(profesorId));
    const paginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA));
    if (paginaActual > paginas) setPaginaActual(paginas);
  }, [datos, profesorId, paginaActual]);

  // Paginación
  const datosFiltrados = datos.filter((d) => String(d.id_prof) === String(profesorId));
  const totalPaginas = Math.max(1, Math.ceil(datosFiltrados.length / FILAS_POR_PAGINA));
  const inicio = (paginaActual - 1) * FILAS_POR_PAGINA;
  const datosPaginados = datosFiltrados.slice(inicio, inicio + FILAS_POR_PAGINA);

  const irAPagina = (p) => p >= 1 && p <= totalPaginas && setPaginaActual(p);

  // PDF - Simplificado para abrir HTML en nueva ventana
  const handleGenerarPDF = async (curso) => {
    try {
      const res = await fetch(`${API}/Reportes/Clases/PDF/${curso.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const html = await res.text();
      const printWindow = window.open('', '_blank', 'width=1000,height=800');
      
      
      if (!printWindow) {
        showAlert('No se pudo abrir la ventana de impresión. Por favor permite ventanas emergentes.', "warning");
        return;
      }
      
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 400);

    } catch (error) {
      console.error("Error al generar PDF:", error);
      showAlert(`No se pudo generar el PDF: ${error.message}`, "error");
    }
  };

  // Excel - Simplificado para descargar archivo XLSX
  const handleExportExcel = async (curso) => {
    try {
      const res = await fetch(`${API}/Reportes/Clases/Excel/${curso.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeName = (curso.nombre || 'lista').replace(/[^a-z0-9_\-]/gi, '_');
      link.download = `${safeName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error al generar Excel:", error);
      showAlert(`No se pudo generar el Excel: ${error.message}`, "error");
    }
  };

  return (
    <div className="admin-container">

    <ProfesorLayout profesorId={profesorId}>
      
      <header className="chat-header">
              <div className="encabezado-section">
                <h1>HORARIOS</h1>
              </div>
              <img src="/escom.png" alt="ESCOM" className="escom-logo" />
            </header>
    
      <section className="gestion-alumnos">
        <h3 className="section-title">Listado de horarios</h3>

        <div className="clases-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Profesor</th>
                <th>Unidad</th>
                <th>Turno</th>
                <th>Carrera</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {datosPaginados.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "1rem" }}>
                    No hay grupos asignados.
                  </td>
                </tr>
              ) : (
                datosPaginados.map((dato) => {
                  const dist = Array.isArray(dato.Distribucion)
                    ? dato.Distribucion
                    : [];

                  const horasPorDia = (dia) => {
                    if (dia === "Miércoles") {
                      return dist
                        .filter((d) => d.dia === "Miércoles" || d.dia === "Miercoles")
                        .map((d) => `${d.hora_ini} - ${d.hora_fin}`)
                        .join(", ");
                    }
                    return dist
                      .filter((d) => d.dia === dia)
                      .map((d) => `${d.hora_ini} - ${d.hora_fin}`)
                      .join(", ");
                  };

                  return (
                    <tr key={dato.id}>
                      <td>{dato.nombre}</td>
                      <td>
                        {dato.DatosPersonale &&
                          `${dato.DatosPersonale.nombre} ${dato.DatosPersonale.ape_paterno} ${dato.DatosPersonale.ape_materno}`}
                      </td>
                      <td>{dato.Unidad_Aprendizaje?.nombre}</td>
                      <td>{dato.turno}</td>
                      <td>{dato.Unidad_Aprendizaje?.carrera}</td>
                      <td>{horasPorDia("Lunes") || "—"}</td>
                      <td>{horasPorDia("Martes") || "—"}</td>
                      <td>{horasPorDia("Miércoles") || "—"}</td>
                      <td>{horasPorDia("Jueves") || "—"}</td>
                      <td>{horasPorDia("Viernes") || "—"}</td>

                      <td className="clases-actions">
                        <button className="cl-btn cl-btn-outline" onClick={() => handleGenerarPDF(dato)}>
                          PDF
                        </button>
                        <button className="cl-btn cl-btn-outline" onClick={() => handleExportExcel(dato)}>
                          Excel
                        </button>
                        <button className="cl-btn cl-btn-primary" onClick={() => handleClickLista(dato.id)}>
                          Pasar lista
                        </button>
                        {(tiempo && dato.reg_final === null )||( tiempo && Number(dato.reg_final) === 0) ||  (tiempo && periodo === "extra" && dato.reg_extra === null) ||  (tiempo && periodo === "extra" && Number(dato.reg_extra) === 0 ) ? ( <button type = "button" className="cl-btn cl-btn-primary" onClick={() => handleClickRegistrar(dato.id)}>Registrar calificaciones del periodo {periodo}</button>) : ( <></> )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINACIÓN ===== */}
        <div className="paginacion">
          <button onClick={() => irAPagina(paginaActual - 1)} disabled={paginaActual === 1}>
            Anterior
          </button>
          <span div className="pagina-activa">
             {paginaActual} / {totalPaginas}
          </span>
          <button
            onClick={() => irAPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </section>
    </ProfesorLayout>
    
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
