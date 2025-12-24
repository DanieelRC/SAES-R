import React from "react";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { SidebarAlumno } from "../components/alumno/SideBarAlumno.jsx";
import "../components/alumno/Alumno.css"; // Para que mantenga tu estilo del header

export function ErrorView() {

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = params.id || location.state?.alumnoId;

  return (
    <div className="alumno-container">
      {/* === Sidebar que ya usas === */}
      <SidebarAlumno />

      {/* === Contenido principal === */}
      <main className="main-content">

        {/* === Header EXACTO como tu Alumno.jsx === */}
        <header className="chat-header">
          <div>
            <h1>Ups... algo salió mal</h1>
            <p>Intenta de nuevo más tarde</p>
          </div>
          <img src="/escom.png" alt="Logo ESCOM" className="header-logo" />
        </header>

        {/* === Contenido del error === */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            textAlign: "center",
          }}
        >
          {/* CARITA TRISTE */}
          <svg
            width="140"
            height="140"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#800000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="15" x2="16" y2="15" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>

          <h2 style={{ marginTop: "20px", fontSize: "26px", color: "#800000" }}>
            ¡Ups! Hubo un problema
          </h2>
          <p style={{ maxWidth: "400px", fontSize: "18px" }}>
            Algo inesperado ocurrió. Por favor, vuelve a intentarlo más tarde.
          </p>

          <button
            style={{
              marginTop: "30px",
              padding: "12px 25px",
              background: "#800000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "17px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/alumno/${id}`)}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    </div>
  );
}
