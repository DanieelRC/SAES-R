import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./ProfesorLayout.css";
import ipnLogo from "../../assets/ipn.png";
import { ProfeSideBar } from "./ProfeSidebar";

export function ProfesorLayout({ children, profesorId: propProfesorId }) {
  const params = useParams();
  const location = useLocation();

  // Id del profesor: viene por prop o por la URL /profesor/:id
  const profesorId = propProfesorId ?? params.id;

  const base = profesorId ? `/profesor/${profesorId}` : "/profesor";

  const inicioUrl = base;
  const gruposUrl = `${base}/clases`;
  const horarioUrl = `${base}/horario`;
  const chatUrl = `${base}/chat`;
  const infoUrl = `${base}/info`;
  const califUrl = `${base}/calificaciones`;

  const { pathname } = location;

  const isInicioActive =
    pathname === inicioUrl || pathname === `/profesor/${profesorId}`;
  const isGruposActive =
    pathname.includes("/clases") || pathname.includes("/PaseLista");
  const isHorarioActive = pathname.includes("/horario");
  const isChatActive = pathname.includes("/chat");
  const isInfoActive =
    pathname.includes("/info") ||
    pathname.toLowerCase().includes("informacion");
  const isCalifActive = pathname.includes("/calificaciones");

  return (
    <div className="profesor-layout">
      {/* SIDEBAR */}
      <ProfeSideBar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="profesor-main">
        <div className="profesor-main-inner">{children}</div>
      </main>
    </div>
  );
}

export default ProfesorLayout;
