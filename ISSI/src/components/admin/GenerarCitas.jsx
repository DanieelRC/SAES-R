import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GenerarCitas.css";
import { AdminSidebar } from "./AdminSidebar";
import Modal from "../Modal";

export function GenerarCitas() {
  const navigate = useNavigate();
  const [fecha_ini, setFecha_ini] = useState("");
  const [fecha_fin, setFecha_fin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalT, setModalT] = useState(false);
  const [edo, setEdo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [p1_inicio, setP1_inicio] = useState("");
const [p1_fin, setP1_fin] = useState("");

const [p2_inicio, setP2_inicio] = useState("");
const [p2_fin, setP2_fin] = useState("");

const [p3_inicio, setP3_inicio] = useState("");
const [p3_fin, setP3_fin] = useState("");

const [ext_inicio, setExt_inicio] = useState("");
const [ext_fin, setExt_fin] = useState("");

const [eval_inicio, setEval_inicio] = useState("");
const [eval_fin, setEval_fin] = useState("");

const [ets_inicio, setEts_inicio] = useState("");
const [ets_fin, setEts_fin] = useState("");

const [ets_pago_inicio, setEts_pago_inicio] = useState("");
const [ets_pago_fin, setEts_pago_fin] = useState("");

const [ets_cal_inicio, setEts_cal_inicio] = useState("");
const [ets_cal_fin, setEts_cal_fin] = useState("");

const [periodo, setPeriodo] = useState("");

  const API = "/api1";

  const handleHoraInicio = (e) => {
    const nuevaFechaini = e.target.value;
    setFecha_ini(nuevaFechaini);

    if (fecha_fin && nuevaFechaini >= fecha_fin) {
      setMensaje({
        tipo: "error",
        texto: "La fecha de inicio no puede ser mayor o igual que la fecha de fin",
      });
      setFecha_ini("");
    } else {
      setMensaje({ tipo: "", texto: "" });
    }
  };

  const handleHoraFin = (e) => {
    const nuevaFechaFin = e.target.value;
    setFecha_fin(nuevaFechaFin);

    if (fecha_ini && nuevaFechaFin <= fecha_ini) {
      setMensaje({
        tipo: "error",
        texto: "La fecha de fin no puede ser menor o igual que la fecha de inicio",
      });
      setFecha_fin("");
    } else {
      setMensaje({ tipo: "", texto: "" });
    }
  };

  const handleRegulares = () => {
    setModalOpen(true);
    setEdo("Regular");
    setFecha_ini("");
    setFecha_fin("");
    setMensaje({ tipo: "", texto: "" });
  };

  const handleIrregulares = () => {
    setModalOpen(true);
    setEdo("Irregular");
    setFecha_ini("");
    setFecha_fin("");
    setMensaje({ tipo: "", texto: "" });
  };

  const TerminarSemestre = async (e) => { 
    e.preventDefault(); 
    
    // Validar fechas antes de enviar
    const fechas = {
      "Primer Parcial (Inicio)": p1_inicio,
      "Primer Parcial (Fin)": p1_fin,
      "Segundo Parcial (Inicio)": p2_inicio,
      "Segundo Parcial (Fin)": p2_fin,
      "Tercer Parcial (Inicio)": p3_inicio,
      "Tercer Parcial (Fin)": p3_fin,
      "Extraordinario (Inicio)": ext_inicio,
      "Extraordinario (Fin)": ext_fin,
      "Evaluación Docente (Inicio)": eval_inicio,
      "Evaluación Docente (Fin)": eval_fin,
      "Inscripción ETS (Inicio)": ets_inicio,
      "Inscripción ETS (Fin)": ets_fin,
      "Pago ETS (Inicio)": ets_pago_inicio,
      "Pago ETS (Fin)": ets_pago_fin,
      "Calif. ETS (Inicio)": ets_cal_inicio,
      "Calif. ETS (Fin)": ets_cal_fin,
    };

    for (const [nombre, fecha] of Object.entries(fechas)) {
      if (fecha) {
        const year = parseInt(fecha.split("-")[0], 10);
        if (year > 2100 || year < 2000) {
          setMensaje({ 
            tipo: "error", 
            texto: `La fecha de "${nombre}" tiene un año inválido (${year}). Por favor verifícala.` 
          });
          return;
        }
      }
    }

    setLoading(true); 
    try { 
      const res = await fetch(`${API}/TerminarSemestre`, { method: "POST", credentials: "include", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          p1_inicio, 
          p1_fin, 
          p2_inicio, p2_fin, p3_inicio, p3_fin, ext_inicio, ext_fin, eval_inicio, eval_fin, ets_inicio, ets_fin, ets_pago_inicio, ets_pago_fin, ets_cal_inicio, ets_cal_fin, periodo 
        }) }); 
        const data = await res.json(); 
        if (!data.success) { 
          setMensaje({ tipo: "error", texto: data.error || "Error al guardar fechas" }); 
          return; } 
        setMensaje({ tipo: "ok", texto: "Fechas guardadas correctamente" }); 
        setTimeout(() => { setModalT(false); 

        }, 1500); 
      } catch (err) { 
        console.error("Error:", err); 
        setMensaje({ tipo: "error", texto: "Error al conectar con el servidor", }); } 
        finally { setLoading(false); } 
    };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/GenerarCitas/${edo}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha_ini, fecha_fin }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje({
          tipo: "success",
          texto: "Las citas se generaron exitosamente",
        });
        setTimeout(() => {
          setModalOpen(false);
          setFecha_ini("");
          setFecha_fin("");
        }, 1500);
      } else {
        setMensaje({
          tipo: "error",
          texto: data.message || "Error al generar las citas",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setMensaje({
        tipo: "error",
        texto: "Error al conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Configuración de fechas relevantes</h1>
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>

        <section className="gc-wrap">
          <div className="gc-buttons-container">
            <button
              className="gc-button gc-button-regular"
              onClick={handleRegulares}
            >
              <div className="gc-button-content">
                <h3>Alumnos Regulares</h3>
                <p>Crear fechas de inscripción para los alumnos regulares</p>
              </div>
            </button>

            <button
              className="gc-button gc-button-irregular"
              onClick={handleIrregulares}
            >
              <div className="gc-button-content">
                <h3>Alumnos Irregulares</h3>
                <p>Crear fechas de inscripción para los alumnos irregulares</p>
              </div>
            </button>
            <button className ="gc-button gc-button-regular" onClick={()=>setModalT(true)}>
              <div className = "gc-button-content">
                <h3>Terminar Semestre</h3>
                <p>Termino del periodo escolar actual y se procede a ingresar las fechas del nuevo periodo</p>
              </div>
            </button>
          </div>
        </section>
       <Modal open={modalT} onClose={() => setModalT(false)}>
  <div className="gc-modal-content">
    <h2 className="gc-modal-title">¿Estás Seguro?</h2>
    <h4>
      Esta acción no se puede deshacer. Ingrese los datos del nuevo semestre.
    </h4>

    <form onSubmit={TerminarSemestre} className="gc-formulario">

      {/* PRIMER PARCIAL */}
      <div className="gc-form-group">
        <label htmlFor="p1_inicio" className="gc-label">
          Registro de calificaciones del primer parcial <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="p1_inicio"
          value={p1_inicio}
          onChange={(e) => setP1_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="p1_fin" className="gc-label">
          Fecha límite del registro de calificaciones del primer parcial <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="p1_fin"
          value={p1_fin}
          onChange={(e) => setP1_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* SEGUNDO PARCIAL */}
      <div className="gc-form-group">
        <label htmlFor="p2_inicio" className="gc-label">
          Registro de calificaciones del segundo parcial <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="p2_inicio"
          value={p2_inicio}
          onChange={(e) => setP2_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="p2_fin" className="gc-label">
          Fecha límite del registro de calificaciones del segundo parcial <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="p2_fin"
          value={p2_fin}
          onChange={(e) => setP2_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* TERCER PARCIAL */}
      <div className="gc-form-group">
        <label htmlFor="p3_inicio" className="gc-label">
          Registro de calificaciones del tercer parcial <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="p3_inicio"
          value={p3_inicio}
          onChange={(e) => setP3_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="p3_fin" className="gc-label">
          Fecha límite del registro de calificaciones del tercer parcial <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="p3_fin"
          value={p3_fin}
          onChange={(e) => setP3_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* EXTRAORDINARIO */}
      <div className="gc-form-group">
        <label htmlFor="ext_inicio" className="gc-label">
          Registro de calificaciones del periodo extraordinario <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ext_inicio"
          value={ext_inicio}
          onChange={(e) => setExt_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>
      <div className="gc-form-group">
        <label htmlFor="ext_fin" className="gc-label">
          Fecha límite de calificaciones del periodo extraordinario <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ext_fin"
          value={ext_fin}
          onChange={(e) => setExt_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* EVALUACIÓN DOCENTE */}
      <div className="gc-form-group">
        <label htmlFor="eval_inicio" className="gc-label">
          Registro de evaluaciones a los profesores <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="eval_inicio"
          value={eval_inicio}
          onChange={(e) => setEval_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="eval_fin" className="gc-label">
          Fecha límite del registro de evaluaciones a los profesores <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="eval_fin"
          value={eval_fin}
          onChange={(e) => setEval_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* ETS */}
      <div className="gc-form-group">
        <label htmlFor="ets_inicio" className="gc-label">
          Fecha para inscribir ETS <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ets_inicio"
          value={ets_inicio}
          onChange={(e) => setEts_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="ets_fin" className="gc-label">
          Fecha límite para inscribir ETS <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ets_fin"
          value={ets_fin}
          onChange={(e) => setEts_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="ets_pago_inicio" className="gc-label">
          Fecha para subir comprobantes de pago de ETS <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ets_pago_inicio"
          value={ets_pago_inicio}
          onChange={(e) => setEts_pago_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="ets_pago_fin" className="gc-label">
          Fecha límite para subir comprobantes de pago de ETS <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ets_pago_fin"
          value={ets_pago_fin}
          onChange={(e) => setEts_pago_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* REGISTRO CALIF ETS */}
      <div className="gc-form-group">
        <label htmlFor="ets_cal_inicio" className="gc-label">
          Fecha para registrar calificaciones de los ETS <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ets_cal_inicio"
          value={ets_cal_inicio}
          onChange={(e) => setEts_cal_inicio(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-group">
        <label htmlFor="ets_cal_fin" className="gc-label">
          Fecha límite para registrar calificaciones de los ETS <span className="gc-required">*</span>
        </label>
        <input
          type="date"
          id="ets_cal_fin"
          value={ets_cal_fin}
          onChange={(e) => setEts_cal_fin(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      {/* PERIODO ESCOLAR */}
      <div className="gc-form-group">
        <label htmlFor="periodo" className="gc-label">
          Periodo Escolar <span className="gc-required">*</span>
        </label>
        <input
          type="text"
          id="periodo"
          placeholder="Ej. 2025-1"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          required
          className="gc-input"
        />
      </div>

      <div className="gc-form-actions">
        <button type="button" className="btn blanco" onClick={() => setModalT(false)}>
          Cancelar
        </button>
        <button type="submit" className="btn azul">
          Terminar el semestre
        </button>
      </div>

    </form>
  </div>
</Modal>


        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="gc-modal-content">
            <h2 className="gc-modal-title">
              {edo === "Regular"
                ? "Fechas de Inscripción - Alumnos Regulares"
                : "Fechas de Inscripción - Alumnos Irregulares"}
            </h2>

            {mensaje.texto && (
              <div className={`gc-mensaje gc-mensaje-${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}

            <form onSubmit={enviarFormulario} className="gc-formulario">
              <div className="gc-form-group">
                <label htmlFor="fecha_inicio" className="gc-label">
                  Fecha de inicio <span className="gc-required">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_inicio"
                  required
                  value={fecha_ini}
                  onChange={handleHoraInicio}
                  className="gc-input"
                />
              </div>

              <div className="gc-form-group">
                <label htmlFor="fecha_fin" className="gc-label">
                  Fecha final <span className="gc-required">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_fin"
                  required
                  value={fecha_fin}
                  onChange={handleHoraFin}
                  className="gc-input"
                />
              </div>

              <div className="gc-form-actions">
                <button
                  type="button"
                  className="btn blanco"
                  onClick={() => setModalOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn azul"
                  disabled={loading}
                >
                  {loading ? "Generando..." : "Generar Citas"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </main>
    </div>
  );
}