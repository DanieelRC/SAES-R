import React from "react";
import { SidebarAlumno } from "../alumno/SideBarAlumno.jsx";
import "./ConocenosAlumno.css";

export function ConocenosAlumno() {
  return (
    <div className="alumno-container">
      <SidebarAlumno />

      <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Conócenos</h1>
          </div>
            <p>
                Información general del sistema SAES-R para alumnado (ESCOM).
              </p>

            <img
              src="/escom.png"
              alt="Logo ESCOM"
              className="cono-logo"
              loading="lazy"
            />
          
        </header>

        <section className="cono-wrap">
          {/* Intro */}
          <article className="cono-card cono-intro">
            <span className="cono-badge">SAES-R • ESCOM</span>
            <h2>Gestión escolar, clara y rápida</h2>
            <p>
              SAES-R centraliza procesos escolares en una plataforma simple y ordenada:
              consulta de información académica, seguimiento y trámites según tu perfil.
            </p>

          </article>

          {/* Misión / Visión */}
          <section className="cono-grid2" id="mision">
            <article className="cono-card">
              <h2>Misión</h2>
              <p>
                Facilitar la vida escolar del alumnado centralizando procesos académicos en
                una plataforma moderna, confiable y fácil de usar.
              </p>
              <ul className="cono-list">
                <li>Acceso rápido a trámites y consulta.</li>
                <li>Interfaz clara y consistente.</li>
                <li>Información organizada por perfil.</li>
              </ul>
            </article>

            <article className="cono-card">
              <h2>Visión</h2>
              <p>
                Ser una plataforma modelo en experiencia de usuario para sistemas escolares,
                integrando automatización, analítica y soporte inteligente.
              </p>
              <ul className="cono-list">
                <li>Mejoras continuas basadas en feedback.</li>
                <li>Compatibilidad móvil y accesibilidad.</li>
                <li>Seguridad y privacidad como prioridad.</li>
              </ul>
            </article>
          </section>

          
                  </section>

        {/* Footer simple */}
        <footer className="cono-footer">
          <div className="cono-footer__inner">
            <div className="cono-footer__contact">
  <div className="h">CONTACTOS</div>

  <div className="item">
    <span className="k">Conmutador IPN:</span>
    <a href="tel:+525572960000" className="v">55 5729 6000</a>
  </div>

  <div className="item">
    <span className="k">DAE (Atención):</span>
    <a href="tel:+52XXXXXXXXXX" className="v">55 5729 6300</a>
  </div>

  <div className="item">
    <span className="k">ESCOM (Control Escolar):</span>
    <a href="tel:+52XXXXXXXXXX" className="v"> 52001 (extensión) </a>
  </div>

 
</div>

            <div className="cono-footer__brand">
              <div className="mark">IPN</div>
              <div>
                <div className="t1">SAES-R • ESCOM / IPN</div>
                
              </div>
            </div>

            <div className="cono-footer__links">
            
              
            </div>
          </div>

          <div className="cono-footer__bottom">
            © {new Date().getFullYear()} SAES-R • ESCOM / IPN
          </div>
        </footer>
      </main>
    </div>
  );
}
