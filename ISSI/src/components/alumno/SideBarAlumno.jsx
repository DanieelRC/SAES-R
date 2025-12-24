import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  FaHome, FaPenNib, FaClock, FaGraduationCap, FaRobot, FaExclamationCircle, 
  FaStar, FaUser, FaListOl, FaInfoCircle, FaMap, FaBalanceScale, 
  FaSignOutAlt, FaTimes 
} from "react-icons/fa";
import "./SideBar.css";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";

export function SidebarAlumno() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Hook para alertas modales
  const { alertState, showAlert, hideAlert } = useAlert();

  const isActive = (path) => location.pathname.startsWith(path);

  const STORAGE_KEY = "saesr_sidebar_alumno_open";

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

  // ⭐⭐⭐ ID universal: URL → state → localStorage
  const id = useMemo(() => {
    const fromUrl = params.id;
    const fromState = location.state?.alumnoId;
    const fromStorage = localStorage.getItem("alumno_id");

    const finalId = fromUrl || fromState || fromStorage;

    // Guardamos solo si viene uno nuevo
    if (finalId && finalId !== fromStorage) {
      localStorage.setItem("alumno_id", finalId);
    }

    return finalId;
  }, [params.id, location.state]);

  // Función de seguridad para evitar errores
  const safeNavigate = (path, state = null) => {
    if (!id) {
      showAlert("⚠ No se pudo obtener tu ID. Inicia sesión nuevamente.", "warning");
      return navigate("/");
    }
    closeIfMobile();
    navigate(path, state ? { state } : undefined);
  };

  // Handlers
  const handleIns = () => safeNavigate(`/alumno/inscripcion/${id}`);
  const handleHorarios = () => safeNavigate(`/alumno/horarios/${id}`);
  const handleKardex = () =>
    safeNavigate(`/alumno/Kardex`, { alumnoId: id });
  const handleChat = () =>
    safeNavigate(`/alumno/Chat`, { alumnoId: id });
  const handleMatRe = () =>
    safeNavigate(`/alumno/MateriasReprobadas`, { alumnoId: id });
  const handleEvaluacion = () => safeNavigate(`/alumno/evaluacion/${id}`);
  const handleEditPer = () => safeNavigate(`/alumno/datosPersonales/${id}`);
  const handleCalif = () =>
    safeNavigate(`/alumno/ConsultarCalificaciones`, { alumnoId: id });
  const handleCono = () => safeNavigate(`/alumno/conocenosAlumno`);
  const handleDetalle = () => safeNavigate(`/alumno/resenas-profesor/${id}`);
  const handleMapas = () =>
    safeNavigate(`/alumno/MapasCurriculares`, { alumnoId: id });

  const handleLogout = async () => {
    try {
      localStorage.removeItem("alumno_id");
      setOpen(false);
      await logout(); // Llamar al logout del hook de autenticación
      // Usar window.location para forzar una recarga completa y asegurar que el estado se limpie
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = "/";
    }
  };

  return (
    <div>
    <>
      {!open && (
        <div>
          <button
            className="sidebar-topbar-btn"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-controls="saesr-alumno-sidebar"
            aria-expanded={open}
            type="button"
          >
            ☰
          </button>
        </div>
      )}

      <aside
        id="saesr-alumno-sidebar"
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
            className={`menu-item ${isActive(`/alumno/${id}`) ? "active" : ""}`}
            onClick={() => safeNavigate(`/alumno/${id}`)}
          >
            <span className="icon"><FaHome /></span>
            <span className="label">Inicio</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/inscripcion") ? "active" : ""}`} onClick={handleIns}>
            <span className="icon"><FaPenNib /></span>
            <span className="label">Inscribir Materias</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/horarios") ? "active" : ""}`} onClick={handleHorarios}>
            <span className="icon"><FaClock /></span>
            <span className="label">Horarios</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/Kardex") ? "active" : ""}`} onClick={handleKardex}>
            <span className="icon"><FaGraduationCap /></span>
            <span className="label">Kardex</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/Chat") ? "active" : ""}`} onClick={handleChat}>
            <span className="icon"><FaRobot /></span>
            <span className="label">Asistente de Chat</span>
          </button>

          <button
            className={`menu-item ${isActive("/alumno/MateriasReprobadas") ? "active" : ""}`}
            onClick={handleMatRe}
          >
            <span className="icon"><FaExclamationCircle /></span>
            <span className="label">Materias Reprobadas</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/evaluacion") ? "active" : ""}`} onClick={handleEvaluacion}>
            <span className="icon"><FaStar /></span>
            <span className="label">Evaluación de Profesores</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/datosPersonales") ? "active" : ""}`} onClick={handleEditPer}>
            <span className="icon"><FaUser /></span>
            <span className="label">Información Personal</span>
          </button>

          <button
            className={`menu-item ${isActive("/alumno/ConsultarCalificaciones") ? "active" : ""}`}
            onClick={handleCalif}
          >
            <span className="icon"><FaListOl /></span>
            <span className="label">Consultar Calificaciones</span>
          </button>

          <button className={`menu-item ${isActive("/alumno/conocenosAlumno") ? "active" : ""}`} onClick={handleCono}>
            <span className="icon"><FaInfoCircle /></span>
            <span className="label">Conocenos</span>
          </button>

          <button
            className={`menu-item ${isActive("/alumno/mapas-curriculares") ? "active" : ""}`}
            onClick={handleMapas}
          >
            <span className="icon"><FaMap /></span>
            <span className="label">Mapas Curriculares</span>
          </button>

          <Link to="/reglamentos" className="menu-item">
            <span className="icon"><FaBalanceScale /></span>
            <span className="label">Reglamentos</span>
          </Link>
        </nav>

        <button className="logout" onClick={handleLogout}>
          <span className="icon"><FaSignOutAlt /></span>
          <span className="label">Cerrar sesión</span>
        </button>
      </aside>

      <button className={`sidebar-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      
      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        message={alertState.message}
        type={alertState.type}
      />
    </>
    </div>
  );
}
