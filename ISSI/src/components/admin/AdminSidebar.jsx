import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaFileAlt, 
  FaNewspaper, FaUniversity, FaListAlt, FaCalendarAlt, FaExclamationTriangle, 
  FaSignOutAlt, FaTimes 
} from "react-icons/fa";
import "./SideBar.css";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  const STORAGE_KEY = "saesr_sidebar_admin_open";
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

  const go = (path, state) => {
    closeIfMobile();
    navigate(path, state ? { state } : undefined);
  };

  const sharedState = { fromSidebar: true };

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
            aria-controls="saesr-admin-sidebar"
            aria-expanded={open}
            type="button"
          >
            ☰
          </button>
        </div>
      )}

      <aside
        id="saesr-admin-sidebar"
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
            className={`menu-item ${isActive("/administrador") && location.pathname === "/administrador" ? "active" : ""}`} 
            onClick={() => go("/administrador", sharedState)}
          >
            <span className="icon"><FaHome /></span>
            <span className="label">Inicio</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/gestionarAlumnos") ? "active" : ""}`} 
            onClick={() => go("/administrador/gestionarAlumnos", sharedState)}
          >
            <span className="icon"><FaUserGraduate /></span>
            <span className="label">Gestionar Alumnos</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/gestionarProfesores") ? "active" : ""}`} 
            onClick={() => go("/administrador/gestionarProfesores", sharedState)}
          >
            <span className="icon"><FaChalkboardTeacher /></span>
            <span className="label">Gestionar Profesores</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/gestionarCursos") ? "active" : ""}`} 
            onClick={() => go("/administrador/gestionarCursos", sharedState)}
          >
            <span className="icon"><FaBook /></span>
            <span className="label">Gestionar Cursos</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/ETS") ? "active" : ""}`} 
            onClick={() => go("/administrador/ETS", sharedState)}
          >
            <span className="icon"><FaFileAlt /></span>
            <span className="label">ETS</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/publicarNoticia") ? "active" : ""}`} 
            onClick={() => go("/administrador/publicarNoticia", sharedState)}
          >
            <span className="icon"><FaNewspaper /></span>
            <span className="label">Publicar Noticia</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/carreras") ? "active" : ""}`} 
            onClick={() => go("/administrador/carreras", sharedState)}
          >
            <span className="icon"><FaUniversity /></span>
            <span className="label">Carreras</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/unidades") ? "active" : ""}`} 
            onClick={() => go("/administrador/unidades", sharedState)}
          >
            <span className="icon"><FaListAlt /></span>
            <span className="label">Unidades</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/Fechas") ? "active" : ""}`} 
            onClick={() => go("/administrador/Fechas", sharedState)}
          >
            <span className="icon"><FaCalendarAlt /></span>
            <span className="label">Configuración de Fechas</span>
          </button>

          <button 
            className={`menu-item ${isActive("/administrador/SituacionesEspeciales") ? "active" : ""}`} 
            onClick={() => go("/administrador/SituacionesEspeciales", sharedState)}
          >
            <span className="icon"><FaExclamationTriangle /></span>
            <span className="label">Situaciones Especiales</span>
          </button>
        </nav>

        <button className="logout" onClick={handleLogout}>
          <span className="icon"><FaSignOutAlt /></span>
          <span className="label">Cerrar sesión</span>
        </button>
      </aside>

<button
  className={`sidebar-overlay ${open ? "show" : ""}`}
  onClick={() => setOpen(false)}
  aria-hidden="true"
/>

    </>
  );
}
