import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Administrador.css";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaTrashAlt,
  FaFileAlt,
  FaBullhorn,
  FaFileInvoiceDollar,
  FaGraduationCap, FaBook
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

import { AdminSidebar } from "../admin/AdminSidebar.jsx";


export function Administrador() {
  const navigate = useNavigate();
  const API = "/api1";

  const [stats, setStats] = useState({
    alumnos: null,
    profesores: null,
    cursos: null,
    proximosEventos: null,
  });
  const [statsError, setStatsError] = useState("");

  const handleClickAlu = () => navigate("gestionarAlumnos");
  const handleClickProf = () => navigate("gestionarProfesores");
  const handleClickCursos = () => navigate("gestionarCursos");
  const handleClickETS = () => navigate("ETS");
  const handleClickPublicarNoticia = () => navigate("publicarNoticia");
  const handleLogout = () => navigate("/");

  const handleETS = () => navigate("/administrador/ETS");
  const handlePublicarNoticia = () => navigate("/administrador/publicarNoticia");
  const handleCarreras = () => navigate("/administrador/carreras");
  const handleUnidades = () => navigate("/administrador/unidades");
  const handleDatosMedicos = () => navigate("/administrador/datosMedicos");
  const handleGenerarCitas = () => navigate("/administrador/GenerarCitas");

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        setStatsError("");
        const res = await fetch(`${API}/EstadisticasGenerales`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();

        if (cancelled) return;
        setStats({
          alumnos: typeof data.alumnos === "number" ? data.alumnos : 0,
          profesores: typeof data.profesores === "number" ? data.profesores : 0,
          cursos: typeof data.cursos === "number" ? data.cursos : 0,
          proximosEventos:
            typeof data.proximosEventos === "number" ? data.proximosEventos : 0,
        });
      } catch (e) {
        if (cancelled) return;
        console.error("Error al cargar estadísticas:", e);
        setStatsError("No se pudieron cargar las estadísticas.");
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatStat = (value) => (typeof value === "number" ? value.toLocaleString() : "—");

  return (
    <div className="admin-container">
      
      <AdminSidebar />
      
      {/* Main content con DISEÑO DEL SEGUNDO */}
      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>¡Bienvenido, Administrador!</h1>
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>

        {/* Acciones rápidas (diseño del segundo, contenido del primero) */}
        <section className="acciones-rapidas">
          <div className="acciones-grid">
            <div className="card highlighted">
              <FaUserGraduate className="icon" />
              <h3>Gestión de Estudiantes</h3>
              <p>Añadir nuevos estudiantes al sistema con todos sus datos relevantes.</p>
              <button onClick={handleClickAlu}>Registrar</button>
            </div>

            <div className="card">
              <FaChalkboardTeacher className="icon" />
              <h3>Gestión de Profesores</h3>
              <p>Incorporar nuevos miembros del personal docente con sus calificaciones.</p>
              <button onClick={handleClickProf}>Registrar</button>
            </div>

            <div className="card">
              <FaBookOpen className="icon" />
              <h3>Gestión de Grupos</h3>
              <p>Crear y configurar nuevos programas y asignaturas.</p>
              <button onClick={handleClickCursos}>Añadir</button>
            </div>

            {/* Esta tarjeta viene del primer código */}
            <div className="card">
              <FaFileInvoiceDollar className="icon" />
              <h3>ETS</h3>
              <p>Revisión de comprobantes de pago de Examenes a Título de Suficiencia.</p>
              <button onClick={handleETS}>Revisar</button>
            </div>

            <div className="card">
              <FaBullhorn className="icon" />
              <h3>Publicar Noticia</h3>
              <p>Publica noticias o eventos relevantes dentro de la comunidad politecnica.</p>
              <button onClick={handleClickPublicarNoticia}>Publicar</button>
            </div>

            {/* También del primer código */}
            <div className="card">
              <FaGraduationCap className="icon" />
              <h3>Carreras</h3>
              <p>Agrega nuevas carreras o consulta las que ya existen.</p>
              <button onClick={handleCarreras}>Consultar</button>
            </div>

             <div className="card">
              <FaBook className="icon" />
              <h3>Unidades de Aprendizaje</h3>
              <p>Agrega nuevas unidades o edita las que ya existen.</p>
              <button onClick={handleUnidades}>Agregar</button>
            </div>

             <div className="card">
              <MdEventAvailable className="icon" />
              <h3>Citas de Inscripción</h3>
              <p>Genera citas para alumnos regulares e irregulares.</p>
              <button onClick={handleGenerarCitas}>Generar</button>
            </div>
          </div>
        </section>

        {/* Estadísticas con diseño del segundo */}
        <section className="estadisticas">
          <h2>Estadísticas Generales</h2>
          {statsError ? (
            <p>{statsError}</p>
          ) : null}
          <div className="stats-grid">
            <div className="stat-card">
              <p>Total de Estudiantes</p>
              <h3>{formatStat(stats.alumnos)}</h3>
            </div>

            <div className="stat-card">
              <p>Total de Profesores</p>
              <h3>{formatStat(stats.profesores)}</h3>
            </div>

            <div className="stat-card">
              <p>Cursos Activos</p>
              <h3>{formatStat(stats.cursos)}</h3>
            </div>

            <div className="stat-card">
              <p>Próximos Eventos</p>
              <h3>{formatStat(stats.proximosEventos)}</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
