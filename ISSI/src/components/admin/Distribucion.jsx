import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import "./Distribucion.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";


export function Distribucion() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [dia, setDia] = useState("");
  const [hora_ini, setHora_ini] = useState("");
  const [hora_fin, setHora_fin] = useState("");
  const [del, setDelete] = useState(false);
  const [id_delete, setId_delete] = useState("");
 const navigate = useNavigate();
  const [modalOpen2, setModalOpen2] = useState(false);
  const [Distri, setDistri] = useState([]);
  const API = '/api1';

  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const { id } = useParams();

  const handleHoraInicio = (e) => {
    const nuevaHoraIni = e.target.value;
    setHora_ini(nuevaHoraIni);

    if (hora_fin && nuevaHoraIni >= hora_fin) {
      showAlert("La hora de inicio no puede ser mayor o igual que la hora de fin", "warning");
      setHora_ini("");
    }
  };

  const handleHoraFin = (e) => {
    const nuevaHoraFin = e.target.value;
    setHora_fin(nuevaHoraFin);

    if (hora_ini && nuevaHoraFin <= hora_ini) {
      showAlert("La hora de fin no puede ser menor o igual que la hora de inicio", "warning");
      setHora_fin("");
    }
  };

  useEffect(() => {
    fetch(`${API}/ObtenerDist/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.Distri) setDistri(data.Distri);
      })
      .catch((err) =>
        console.error("Error la distribucion de horas del grupo:", err)
      );
  }, [id]);

  const enviarFormulario = (e) => {
    e.preventDefault();

    fetch(`${API}/AgregarDist/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_grupo: id, dia, hora_ini, hora_fin }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMensaje("Día agregado correctamente");
        } else {
          setMensaje("Error al agregar el día: " + data.message);
        }
      })
      .catch((err) => console.error("Error al agregar el día:", err));

    setModalOpen(false);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    };

  const handleClickAbrir = (id) => {
    setModalOpen2(true);
    setId_delete(id);
  };

  const handleClickDelete = () => {
    setDelete(true);
  };

  useEffect(() => {
    if (!del) return;

    fetch(`${API}/EliminarDist/${id_delete}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("Día eliminado correctamente", "success");
          setModalOpen2(false);
        } else {
          showAlert("Error al eliminar el día", "error");
        }
      })
      .catch((err) => console.error("Error al eliminar el día:", err));

    setDelete(false);
    setModalOpen2(false);
  }, [del, id_delete]);

   const handleClickAlu = () => navigate("gestionarAlumnos");
  const handleClickProf = () => navigate("gestionarProfesores");
  const handleClickCursos = () => navigate("gestionarCursos");
const handleLogout = () => {navigate(`/`);};

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
          <h1>Distribución</h1>
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>
    <section className="dist-wrap">
      

      <button className="btn azul" onClick={() => setModalOpen(true)}>
        Agregar un día
      </button>

      {mensaje && <p className="mensaje dist-message">{mensaje}</p>}

      <div style={{ overflowX: "auto", width: "100%" }}>
      <table className="table" >
        <thead>
          <tr>
            <th>Día</th>
            <th>Hora que inicia la clase</th>
            <th>Hora que finaliza la clase</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Distri.length > 0 ? (
            Distri.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.dia}</td>
                <td>{dato.hora_ini}</td>
                <td>{dato.hora_fin}</td>
                <td>
                  <button
                    className="btn blanco"
                    onClick={() => handleClickAbrir(dato.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="dist-empty" colSpan="4">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="titulo dist-modal-title">Registrar nuevo día</h2>
        <form onSubmit={enviarFormulario} className="formulario dist-form">
          <label>Día:</label>
          <select
            onChange={(e) => setDia(e.target.value)}
            value={dia}
            required
          >
            <option value="">-- Selecciona un día --</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>

          <label>Hora que inicia la clase:</label>
          <input
            type="time"
            min="07:00"
            max="22:00"
            value={hora_ini}
            onChange={handleHoraInicio}
            required
          />

          <label>Hora que finaliza la clase:</label>
          <input
            type="time"
            min="07:00"
            max="22:00"
            value={hora_fin}
            onChange={handleHoraFin}
            required
          />

          <button type="submit" className="btn azul">
            Enviar
          </button>
        </form>
      </Modal>

      <Modal open={modalOpen2} onClose={() => setModalOpen2(false)}>
        <h2 className="titulo dist-modal-title">Eliminar día</h2>
        <p className="dist-modal-text">
          ¿Estás seguro de que deseas eliminar este día?
        </p>
        <button className="btn azul" onClick={handleClickDelete}>
          Eliminar
        </button>
        <button className="btn blanco" onClick={() => setModalOpen2(false)}>
    Cancelar
      </button>
      </Modal>
    </section>
    
    {/* Modal de alertas */}
    <AlertModal
      isOpen={alertState.isOpen}
      onClose={hideAlert}
      message={alertState.message}
      type={alertState.type}
    />
    </main>
    </div>
  );
}
