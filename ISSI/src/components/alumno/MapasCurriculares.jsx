// src/components/alumno/MapasCurriculares.jsx
import React, { useState, useMemo } from "react";
import { SidebarAlumno } from "./SideBarAlumno";
import "./MapasCurriculares.css";

/* ============================================================
   Datos estáticos: carreras y mapas curriculares
============================================================ */
const CARRERAS = [
  {
    id: "IIA",
    nombre: "Ingeniería en Inteligencia Artificial",
    folderProgramas: "iia",
    mapaImg: "/docs/mapas_curriculares/iia-2020.png",
    mapaPdf: "/docs/mapas_curriculares/mapaCurricularIIA2020.pdf",
    anio: "2020",
  },
  {
    id: "ISC",
    nombre: "Ingeniería en Sistemas Computacionales",
    folderProgramas: "isc",
    mapaImg: "/docs/mapas_curriculares/isc-2020.png",
    mapaPdf: "/docs/mapas_curriculares/mapaCurricularISC2020.pdf",
    anio: "2020",
  },
  {
    id: "LCD",
    nombre: "Licenciatura en Ciencia de Datos",
    folderProgramas: "lcd",
    mapaImg: "/docs/mapas_curriculares/lcd-2020.png",
    mapaPdf: "/docs/mapas_curriculares/mapaCurricularLCD2020.pdf",
    anio: "2020",
  },
];

/* ============================================================
   Programas académicos: nombres de archivos reales
============================================================ */
const PROGRAMAS_IIA = [
  "desarrolloHabilidadesSociales_IIA2020.pdf",
  "trabajoTerminalII_IIA2020.pdf",
  "gestionEmpresarial_IIA2020.pdf",
  "formulacionEvaluacionProyectosInformaticos_IIA2020.pdf",
  "trabajoTerminalI_IIA2020.pdf",
  "reconocimientoVoz_IIA2020.pdf",
  "metodologiaInvestigacionDivulgacionCientifica_IIA2020.pdf",
  "ingSoftwareSistemasInteligentes_IIA2020.pdf",
  "redesNeuronalesAprendizajeProfundo_IIA2020.pdf",
  "computoParalelo_IIA2020.pdf",
  "tecnologiasLenguajeNatural_IIA2020.pdf",
  "algoritmosBioinspirados_IIA2020.pdf",
  "procesamientoSenales_IIA2020.pdf",
  "visionArtificial_IIA2020.pdf",
  "aprendizajeMaquina_IIA2020.pdf",
  "procesamientoDigitalImagenes_IIA2020.pdf",
  "analisisDisenoSistemas_IIA2020.pdf",
  "tecnologiasDesarrolloAplicacionesWeb_IIA2020.pdf",
  "matematicasAvanzadasIngenieria_IIA2020.pdf",
  "teoriaComputacional_IIA2020.pdf",
  "probabilidadEstadistica_IIA2020.pdf",
  "fundamentosInteligenciaArtificial_IIA2020.pdf",
  "liderazgoPersonal_IIA2020.pdf",
  "disenoSistemasDigitales_IIA2020.pdf",
  "basesDatos_IIA2020.pdf",
  "ecuacionesDiferenciales_IIA2020.pdf",
  "paradigmasProgramacion_IIA2020.pdf",
  "analisisDisenoAlgoritmos_IIA2020.pdf",
  "finanzasEmpresariales_IIA2020.pdf",
  "algebraLineal_IIA2020.pdf",
  "ingenieriaEticaSociedad_IIA2020.pdf",
  "calculoMultivariable_IIA2020.pdf",
  "fundamentosEconomicos_IIA2020.pdf",
  "mecanicaElectromagnetismo_IIA2020.pdf",
  "comunicacionOralEscrita_IIA2020.pdf",
  "calculo_IIA2020.pdf",
  "fundamentosDisenoDigital_IIA2020.pdf",
  "algoritmosEstructurasDatos_IIA2020.pdf",
  "matematicasDiscretas_IIA2020.pdf",
  "fundamentosProgramacion_IIA2020.pdf",
];

const PROGRAMAS_ISC = [
  "administracionServiciosRed_ISC2020.pdf",
  "algebraLineal_ISC2020.pdf",
  "algoritmosEstructurasDatos_ISC2020.pdf",
  "analisisDisenoAlgoritmos_ISC2020.pdf",
  "analisisDisenoSistemas_ISC2020.pdf",
  "analisisVectorial_ISC2020.pdf",
  "aplicacionesComunicacionesRed_ISC2020.pdf",
  "arquitectutaComputadoras_ISC2020.pdf",
  "basesDatos_ISC2020.pdf",
  "calculo_ISC2020.pdf",
  "calculoAplicado_ISC2020.pdf",
  "circuitosElectricos_ISC2020.pdf",
  "compiladores.pdf",
  "comunicacionOralEscrita_ISC2020.pdf",
  "desarrolloAplicacionesMovilesNativas_ISC2020.pdf",
  "desarrolloHabilidadesSocialesAltaDireccion_ISC2020.pdf",
  "disenoSistemasDigitales_ISC2020.pdf",
  "ecuacionesDiferenciales_ISC2020.pdf",
  "electronicaAnalogica_ISC2020.pdf",
  "finanzasEmpresariales_ISC2020.pdf",
  "formulacionEvaluacionProyectosInformaticos.pdf",
  "fundamentosDisenoDigital_ISC2020.pdf",
  "fundamentosEconomicos_ISC2020.pdf",
  "fundamentosProgramacion_ISC2020.pdf",
  "gestionEmpresarial_ISC2020.pdf",
  "ingenieriaEticaSociedad_ISC2020.pdf",
  "ingenieriaSoftware_ISC2020.pdf",
  "instrumentacionControl_ISC2020.pdf",
  "inteligenciaArtificial_ISC2020.pdf",
  "liderazgoPersonal_ISC2020.pdf",
  "matematicasAvanzadasIngenieria_ISC2020.pdf",
  "matematicasDiscretas_ISC2020.pdf",
  "mecanicaElectromagnetismo_ISC2020.pdf",
  "metodosCuantitativosTomaDecisiones_ISC2020.pdf",
  "paradigmasProgramacion_ISC2020.pdf",
  "probabilidadEstadistica_ISC2020.pdf",
  "procesamientoDigitalSenales_ISC2020.pdf",
  "redesComputadoras_ISC2020.pdf",
  "sistemasChip_ISC2020.pdf",
  "sistemasDistribuidos_ISC2020.pdf",
  "sistemasOperativos_ISC2020.pdf",
  "tecnologiasDesarrolloAplicacionesWeb_ISC2020.pdf",
  "teoriaComputacion_ISC2020.pdf",
  "trabajoTerminalI_ISC2020.pdf",
];

const PROGRAMAS_LCD = [
  "administracionProyectosTI_LCD2020.pdf",
  "algebraLineal_LCD2020.pdf",
  "algoritmosEstructurasDatos_LCD2020.pdf",
  "analisisDisenoAlgoritmos_LCD2020.pdf",
  "analisisSeriesTiempo_LCD2020.pdf",
  "analiticaAvanzadaDatos_LCD2020.pdf",
  "analiticaVisualizacionDatos_LCD2020.pdf",
  "aprendizajeMaquinaInteligenciaArtificial_LCD2020.pdf",
  "basesDatos_LCD2020.pdf",
  "basesDatosAvanzadas_LCD2020.pdf",
  "bigData_LCD2020.pdf",
  "calculo_LCD2020.pdf",
  "calculoMultivariable_LCD2020.pdf",
  "computoAltoDesempeno_LCD2020.pdf",
  "comunicacionOralEscrita_LCD2020.pdf",
  "desarrolloAplicacionesAnalisisDatos_LCD2020.pdf",
  "desarrolloAplicacionesWeb_LCD2020.pdf",
  "desarrolloHabilidadesSociales_LCD2020.pdf",
  "estadistica_LCD2020.pdf",
  "eticaLegalidad_LCD2020.pdf",
  "finanzasEmpresariales_LCD2020.pdf",
  "fundamentosEconomicos_LCD2020.pdf",
  "fundamentosProgramacion_LCD2020.pdf",
  "gestionEmpresarial_LCD2020.pdf",
  "introduccionCienciaDatos_LCD2020.pdf",
  "liderazgoPersonal_LCD2020.pdf",
  "matematicasAvanzadasCienciaDatos_LCD2020.pdf",
  "matematicasDiscretas_LCD2020.pdf",
  "metodologiaInvestigacionDivulgacionCientifica_LCD2020.pdf",
  "metodosNumericos_LCD2020.pdf",
  "mineriaDatos_LCD2020.pdf",
  "modeladoPredictivo_LCD2020.pdf",
  "modelosEconometricos_LCD2020.pdf",
  "probabilidad_LCD2020.pdf",
  "procesamientoLenguajeNatural_LCD2020.pdf",
  "procesosEstocasticos_LCD2020.pdf",
  "programacionCienciaDatos_LCD2020.pdf",
  "trabajoTerminalI_LCD2020.pdf",
  "trabajoTerminalII_LCD2020.pdf",
];

const PROGRAMAS = {
  IIA: PROGRAMAS_IIA,
  ISC: PROGRAMAS_ISC,
  LCD: PROGRAMAS_LCD,
};

/* ============================================================
   Helpers
============================================================ */
const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const fileToDisplayName = (fileName) => {
  // quitar extensión
  let base = fileName.replace(/\.pdf$/i, "");
  // quitar sufijo _IIA2020 / _ISC2020 / _LCD2020
  base = base.replace(/_(IIA|ISC|LCD)\d{4}$/i, "");
  // separar camelCase y reemplazar "_"
  base = base
    .replace(/([a-z])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
    .replace(/_/g, " ");
  // capitalizar
  return base
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/* ============================================================
   Componente principal
============================================================ */
const MapasCurriculares = () => {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("IIA");
  const [busqueda, setBusqueda] = useState("");

  const carreraActual = useMemo(
    () => CARRERAS.find((c) => c.id === carreraSeleccionada),
    [carreraSeleccionada]
  );

  const programasFiltrados = useMemo(() => {
    const lista = PROGRAMAS[carreraSeleccionada] || [];
    if (!busqueda.trim()) return lista;

    const needle = normalizeText(busqueda);
    return lista.filter((file) =>
      normalizeText(fileToDisplayName(file)).includes(needle)
    );
  }, [carreraSeleccionada, busqueda]);

  return (
    <div className="alumno-container">
      <SidebarAlumno />

      <main className="main-content mapas-main">
        {/* Encabezado general */}
        <header className="chat-header">
          <div className="encabezado-section">
            <div> 
            <h1>Mapas Curriculares</h1>
            </div>
            </div>
            <div> 
            <p>
              Consulta el mapa curricular y los programas académicos de cada
              carrera.
            </p>
            </div>
          
          <img src="/escom.png" alt="ESCOM" className="escom-logo" />
        </header>

        {/* CARD 1: Mapa curricular + selector de carrera */}
        <section className="clases-card mapa-card">
          <div className="clases-header">
            <h2 className="clases-title">Mapa Curricular</h2>

            <div>
              <label
                htmlFor="select-carrera"
                style={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  marginRight: "0.4rem",
                }}
              >
                Carrera:
              </label>
              <select
                id="select-carrera"
                value={carreraSeleccionada}
                onChange={(e) => setCarreraSeleccionada(e.target.value)}
                style={{
                  borderRadius: "999px",
                  border: "1px solid #e5e7eb",
                  padding: "0.35rem 0.9rem",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              >
                {CARRERAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {carreraActual && (
            <>
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#222",
                }}
              >
                {carreraActual.nombre} ({carreraActual.anio})
              </h3>

              <div className="mapa-img-wrapper">
                <img
                  src={carreraActual.mapaImg}
                  alt={`Mapa curricular ${carreraActual.nombre}`}
                  className="mapa-img"
                />
              </div>

              <div className="mapa-actions">
                <a
                  href={carreraActual.mapaPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cl-btn"
                >
                  Descargar mapa curricular (PDF)
                </a>
              </div>
            </>
          )}
        </section>

        {/* CARD 2: Programas académicos */}
        <section className="clases-card">
          <div className="clases-header">
            <h2 className="clases-title">
              Programas Académicos ({carreraActual?.anio})
            </h2>
          </div>

          <div className="programas-header">
            <p>
              Busca por nombre de unidad de aprendizaje y descarga el programa
              académico correspondiente.
            </p>
          </div>

          <div className="programas-search">
            <input
              type="text"
              placeholder="Buscar unidad de aprendizaje…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="clases-table-wrapper">
            <table className="clases-table">
              <thead>
                <tr>
                  <th>Unidad de Aprendizaje</th>
                  <th>Programa</th>
                </tr>
              </thead>
              <tbody>
                {programasFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="programas-empty">
                      No se encontraron programas que coincidan con la
                      búsqueda.
                    </td>
                  </tr>
                ) : (
                  programasFiltrados.map((file) => (
                    <tr key={file}>
                      <td>{fileToDisplayName(file)}</td>
                      <td className="clases-actions">
                        <a
                          href={`/docs/programas_academicos/${carreraActual.folderProgramas}/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cl-btn"
                        >
                          Descargar PDF
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MapasCurriculares;
