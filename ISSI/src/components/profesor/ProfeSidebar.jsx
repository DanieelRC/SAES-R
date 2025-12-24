import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaHome, FaChalkboardTeacher, FaFileAlt, FaRobot, FaUser, FaStar, FaSignOutAlt, FaTimes } from "react-icons/fa";
import "./SideBar.css";

export function ProfeSideBar() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path) => location.pathname.includes(path);

  // ===== Toggle sidebar =====
  const STORAGE_KEY = "saesr_sidebar_profe_open";
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? true : saved === "1";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    // IMPORTANTE: ya no movemos el layout con body.sidebar-open (drawer overlay)
  }, [open]);

  const closeIfMobile = useCallback(() => {
    if (window.innerWidth <= 768) setOpen(false);
  }, []);

  // ===== Tu lógica existente =====
  const periodo = location.state?.periodo || localStorage.getItem("periodo");
  useEffect(() => {
    if (location.state?.periodo) localStorage.setItem("periodo", location.state.periodo);
  }, [location.state]);

  const finalId = useMemo(() => {
    return location.state?.profesorId || params.id || localStorage.getItem("profesorId") || null;
  }, [location, params]);

  useEffect(() => {
    if (finalId) localStorage.setItem("profesorId", finalId);
  }, [finalId]);

  const go = (path, state) => {
    closeIfMobile();
    navigate(path, state ? { state } : undefined);
  };

  const handleInicio = () => {
    if (finalId) go(`/profesor/${finalId}`, { profesorId: finalId, fromSidebar: true });
    else go("/profesor");
  };

  const handleClases = () =>
    go(`/profesor/${finalId}/clases`, { profesorId: finalId, fromSidebar: true });

  const handleETS = () =>
    go(`/profesor/${finalId}/ets`, { profesorId: finalId, fromSidebar: true });

  const handleChat = () =>
    go(`/profesor/Chat`, { profesorId: finalId, tipo_usuario: "profesor", fromSidebar: true });

  const handleInfoPersonal = () =>
    go(`/profesor/informacionPersonal/${finalId}`, { profesorId: finalId, fromSidebar: true });

  const handleEvaluacion = () =>
    go(`/profesor/${finalId}/evaluacion`, { profesorId: finalId, fromSidebar: true });

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      {!open && (
        <div>
          <button
            className="sidebar-topbar-btn"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-controls="saesr-profe-sidebar"
            aria-expanded={open}
            type="button"
          >
            ☰
          </button>
        </div>
      )}

      <aside
        id="saesr-profe-sidebar"
        className={`sidebar ${open ? "is-open" : "is-closed"}`}
      >
        <div className="sidebar-header">
          <div className="logo">
            <img src="/ipn.png" alt="Logo" className="logo-img" />
            <span>SAES-R</span>
          </div>

          <button className="sidebar-close" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="menu">
          <button 
            onClick={handleInicio} 
            className={`menu-item ${location.pathname === `/profesor/${finalId}` || location.pathname === "/profesor" ? "active" : ""}`}
          >
            <span className="icon"><FaHome /></span>
            <span className="label">Inicio</span>
          </button>

          <button 
            className={`menu-item ${location.pathname.includes("/clases") ? "active" : ""}`} 
            onClick={handleClases}
          >
            <span className="icon"><FaChalkboardTeacher /></span>
            <span className="label">Clases Impartidas</span>
          </button>

          <button 
            className={`menu-item ${location.pathname.includes("/ets") ? "active" : ""}`} 
            onClick={handleETS}
          >
            <span className="icon"><FaFileAlt /></span>
            <span className="label">ETS</span>
          </button>

          <button 
            className={`menu-item ${location.pathname.includes("/Chat") ? "active" : ""}`} 
            onClick={handleChat}
          >
            <span className="icon"><FaRobot /></span>
            <span className="label">Asistente de Chat</span>
          </button>

          <button 
            className={`menu-item ${location.pathname.includes("/informacionPersonal") ? "active" : ""}`} 
            onClick={handleInfoPersonal}
          >
            <span className="icon"><FaUser /></span>
            <span className="label">Información Personal</span>
          </button>

          <button 
            className={`menu-item ${location.pathname.includes("/evaluacion") ? "active" : ""}`} 
            onClick={handleEvaluacion}
          >
            <span className="icon"><FaStar /></span>
            <span className="label">Evaluación Docente</span>
          </button>
        </nav>

        <button className="logout" onClick={handleLogout}>
          <span className="icon"><FaSignOutAlt /></span>
          <span className="label">Cerrar sesión</span>
        </button>
      </aside>

      <button className={`sidebar-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
}
