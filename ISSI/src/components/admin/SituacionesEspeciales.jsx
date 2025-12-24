// ...existing code...
import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import Modal from "../Modal";
import "./SituacionesEspeciales.css";
import { data } from "react-router-dom";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function SituacionesEspeciales() {
  const API = "/api1";

  const [alumnosSinTiempo, setAlumnosSinTiempo] = useState([]);
  const [alumnosDesfasados, setAlumnosDesfasados] = useState([]);
  const [modalTiempo, setModalTiempo] = useState(false);
  const [modalDesfase, setModalDesfase] = useState(false);
  const [periodosExtra, setPeriodosExtra] = useState("");
  const [materiasForm, setMateriasForm] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [id, setId] = useState("");

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    fetch(`${API}/SituacionesEspeciales`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAlumnosSinTiempo(data.alumnosSinSemestres);
        setAlumnosDesfasados(data.alumnosDesfasados);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDes = async(id) =>{

    const res = await fetch(`${API}/DesfasadasAl/${id}`, {method: "GET", credentials:"include"})
    .then((res)=>res.json())
    .then((data)=>{
        setMaterias(data.materiasDes);
        setMateriasForm(
          data.materiasDes.map((m) => ({
          id: m.id,
          creditosExtra: "",
          semestresExtra: "",
          reinscripcion: false,
        })))
    }).catch((err)=>{console.log(err)});
    
    setId(id);
    setModalDesfase(true)
  };
  const handleT = (id)=>{
    setModalTiempo(true);
    setId(id);

  }

const handleSubmitDesfase = async (e) => {
  e.preventDefault();

  await fetch(`${API}/AutorizarCambiosDesfase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      id: id,
      materias: materiasForm
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setModalDesfase(false);
      if (data.success) {
        showAlert("Se han registrado satisfactoriamente los cambios.", "success", "", ()=>window.location.reload());

      } else {
        showAlert("Ha ocurrido un error.", "error","", ()=>window.location.reload());

      }
    });

  

};

  const handleSubmitSS = async(e)=>{
    e.preventDefault();

    await fetch(`${API}/AutorizarCambiosSS`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id: id, periodosExtra : periodosExtra}),
    }).then((res)=> res.json()).then((data)=>{
      setModalTiempo(false);
      if(data.success){
        showAlert("Se han registrado satisfactoriamente los cambios.", "success", "", ()=>window.location.reload());

      }
      else{
        showAlert("Ha ocurrido un error.", "error","", ()=>window.location.reload());

      }
    });
    
      

  }

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="contenido">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Alumnos con situaciones especiales</h1>
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>

        <div className="filtros">
          <label>
            Filtrar:
            <select>
              <option value="">Todos</option>
              <option value="desfasados">Desfasados</option>
              <option value="sin_semestres">Sin semestres</option>
            </select>
          </label>

          <div className="busqueda">
            <input type="text" placeholder="Buscar alumno..." />
            <button className="btn-buscar" title="Buscar">🔎</button>
          </div>
        </div>

        {/* Tabla: Alumnos desfasados */}
        <div className="tabla-contenedor" style={{ marginBottom: 20 }}>
          <div className="tabla-header">
            <h2>Alumnos desfasados</h2>
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>Boleta</th>
                <th>Nombre</th>
                <th>Semestres restantes</th>
                <th>Promedio</th>
                <th>Materias desfasadas</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {alumnosDesfasados && alumnosDesfasados.length > 0 ? (
                alumnosDesfasados.map((alumno, index) => (
                  <tr key={alumno.id || index}>
                    <td>{alumno.id}</td>
                    <td>{alumno.nombre} {alumno.ape_paterno} {alumno.ape_materno}</td>
                    <td>{alumno.Kardex?.semestres_restantes ?? "N/A"}</td>
                    <td>{alumno.Kardex?.promedio ?? "N/A"}</td>
                    <td>{alumno.Estudiante?.Materia_Reprobadas?.length}</td>
                    <td>
                      <button className="btn azul" onClick={()=> handleDes(alumno.id)}>Acciones</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay alumnos desfasados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tabla: Alumnos sin semestres */}
        <div className="tabla-contenedor">
          <div className="tabla-header">
            <h2>Alumnos sin semestres disponibles</h2>
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>Boleta</th>
                <th>Nombre</th>
                <th>Promedio</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {alumnosSinTiempo && alumnosSinTiempo.length > 0 ? (
                alumnosSinTiempo.map((alumno, index) => (
                  <tr key={alumno.id || index}>
                    <td>{alumno.id}</td>
                    <td>{alumno.nombre} {alumno.ape_paterno} {alumno.ape_materno}</td>
                    <td>{alumno.Kardex?.promedio ?? "N/A"}</td>
                    <td>
                      <button className="btn azul" onClick={()=>handleT(alumno.id)}>Acciones</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay alumnos sin semestres disponibles</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="tabla-footer">

            <div className="paginacion">
              <button disabled>Anterior</button>
              <span className="pagina-activa">1 / 1</span>
              <button disabled>Siguiente</button>
            </div>
          </div>
        </div>
      </main>

      <Modal open={modalTiempo} onClose={() => setModalTiempo(false)}>
  <div className="gc-modal-content">
    <h2 className="gc-modal-title">Agregar tiempo</h2>

    <form className="gc-formulario" onSubmit={handleSubmitSS}>
      <div className="gc-form-group">
        <label className="gc-label">
          Ingresar periodos extra <span className="gc-required">*</span>
        </label>
        <input 
          type="number" 
          className="gc-input"
          onChange={(e)=> setPeriodosExtra(e.target.value)}
        />
      </div>

      <div className="gc-form-actions">
        <button type="button" className="gc-btn gc-btn-cancelar" 
                onClick={() => setModalTiempo(false)}>
          Cancelar
        </button>
        <button type="submit" className="gc-btn gc-btn-enviar">
          Autorizar
        </button>
      </div>
    </form>
  </div>
</Modal>


      <Modal open={modalDesfase} onClose={() => setModalDesfase(false)}>
  <div className="gc-modal-content">
    <h2 className="gc-modal-title">Materias desfasadas</h2>

    <form onSubmit={handleSubmitDesfase} className="gc-formulario">
      <div className="tabla-contenedor" style={{ marginTop: "15px" }}>
        <table className="tabla">
          <thead>
            <tr>
              <th>Materia</th>
              <th>Créditos extra</th>
              <th>Periodos extra</th>
              <th>Reinscripción</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(materias) && materias.length > 0 ? (
              materias.map((materia) => {
                const mf = materiasForm.find((m) => m.id === materia.id);

                return (
                  <tr key={materia.id}>
                    <td>{materia.Unidad_Aprendizaje?.nombre ?? "Sin nombre"}</td>

                    <td>
                      <input
                        type="number"
                        className="gc-input"
                        value={mf?.creditosExtra || ""}
                        onChange={(e) =>
                          setMateriasForm((prev) =>
                            prev.map((item) =>
                              item.id === materia.id
                                ? { ...item, creditosExtra: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="gc-input"
                        value={mf?.semestresExtra || ""}
                        onChange={(e) =>
                          setMateriasForm((prev) =>
                            prev.map((item) =>
                              item.id === materia.id
                                ? { ...item, semestresExtra: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={mf?.reinscripcion || false}
                        onChange={(e) =>
                          setMateriasForm((prev) =>
                            prev.map((item) =>
                              item.id === materia.id
                                ? { ...item, reinscripcion: e.target.checked }
                                : item
                            )
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                  No hay materias desfasadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="gc-form-actions" style={{ marginTop: "20px" }}>
        <button
          type="button"
          className="gc-btn gc-btn-cancelar"
          onClick={() => setModalDesfase(false)}
        >
          Cerrar
        </button>

        <button type="submit" className="gc-btn gc-btn-enviar">
          Autorizar
        </button>
      </div>
    </form>
  </div>
</Modal>


    
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
