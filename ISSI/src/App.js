import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// FORMULARIO
import { Formulario } from "./components/formulario/Formulario";
import RecuperarContra from "./components/formulario/RecuperarContra";

// ALUMNO

import { ConocenosAlumno } from "./components/alumno/ConocenosAlumno";
import { Alumno } from "./components/alumno/Alumno";
import { ChatbotAsistente } from "./components/alumno/Chat";
import Horarios from "./components/alumno/Horarios";
import { Inscripcion } from "./components/alumno/Inscripcion";
import { EditarDatos } from "./components/alumno/EditarDatosPersonales";
import { HistorialAcademico } from "./components/alumno/HistorialAcademico";
import { MateriasReprobadas } from "./components/alumno/MateriasReprobadas";
import { EvaluacionProfesores } from "./components/alumno/EvaluacionProfesores";
import { DatosPersonales } from "./components/alumno/DatosPersonales";
import { ConsultarCalificaciones } from "./components/alumno/ConsultarCalificaciones";
import ResenarProfesores from "./components/alumno/ResenarProfesores";
import DetalleProfesorResenas from "./components/alumno/DetalleProfesorResenas";
import MapasCurriculares from "./components/alumno/MapasCurriculares";
// PROFESOR
import { Profesor } from "./components/profesor/Profesor";
import { ChatbotProfesor } from "./components/profesor/Chat";
import { ClasesImpartidas } from "./components/profesor/ClasesImpartidas";
import { PaseLista } from "./components/profesor/PaseLista";
import { RegistrarCalificaciones } from "./components/profesor/RegistrarCalificaciones";
import { InformacionPersonal } from "./components/profesor/InformacionPersonal";
import { EditarDatosPersonales } from "./components/profesor/EditarDatosPersonales";
import { ETS as ETSProfesor } from "./components/profesor/ETS";
import EvaluacionDocente from "./components/profesor/EvaluacionDocente";
import { Reglamentos } from "./pages/Reglamentos";

// PROFESOR

// ADMIN
import { Administrador } from "./components/admin/Administrador";
import { RegistrarAlumnos } from "./components/admin/RegistrarAlumnos";
import { RegistrarProfesores } from "./components/admin/RegistrarProfesores";
import { RegistrarCursos } from "./components/admin/RegistrarCursos";
import { GestionarAlumnos } from "./components/admin/GestionarAlumnos";
import { GestionarProfesores } from "./components/admin/GestionarProfesores";
import { GestionarCursos } from "./components/admin/GestionarCursos";
import { EditarAlumnos } from "./components/admin/EditarAlumnos";
import { EditarProfesores } from "./components/admin/EditarProfesores";
import { EditarGrupo } from "./components/admin/EditarGrupo";
import { Distribucion } from "./components/admin/Distribucion";
import { ETS } from "./components/admin/ETS";
import { PublicarNoticia } from "./components/admin/PublicarNoticia";
import { GenerarCitas } from "./components/admin/GenerarCitas";
import { InscripcionAdmin } from "./components/admin/InscripcionAdmin";

import { SituacionesEspeciales } from "./components/admin/SituacionesEspeciales";
// PAGINAS INDIVIDUALES
import { Carreras } from "./pages/Carreras";
import { Unidades } from "./pages/Unidades";
import { DatosMedicos } from "./pages/DatosMedicos";
import { ErrorView } from "./pages/Errores";

function AppContent() {
  const { authenticated, user } = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route
            path="/"
            element={
              authenticated ? (
                user.tipo_usuario === "alumno" ? (
                  <Navigate to={`/alumno/${user.id}`} replace />
                ) : user.tipo_usuario === "administrador" ? (
                  <Navigate to="/administrador" replace />
                ) : user.tipo_usuario === "profesor" ? (
                  <Navigate to={`/profesor/${user.id}`} replace />
                ) : (
                  <Navigate to="/error" replace />
                )
              ) : (
                <Formulario />
              )
            }
          />
          <Route path="/recuperar-contrasena" element={<RecuperarContra />} />

          {/* ALUMNO */}
          <Route path="/alumno/:id" element={<ProtectedRoute allowedRoles={['alumno']}><Alumno /></ProtectedRoute>} />
          <Route path="/alumno/Chat" element={<ProtectedRoute allowedRoles={['alumno']}><ChatbotAsistente /></ProtectedRoute>} />
          <Route path="/alumno/horarios/:id" element={<ProtectedRoute allowedRoles={['alumno']}><Horarios /></ProtectedRoute>} />
          <Route
            path="/alumno/evaluacion/:id"
            element={<ProtectedRoute allowedRoles={['alumno']}><EvaluacionProfesores /></ProtectedRoute>}
          />
          <Route path="/alumno/conocenosAlumno" element={<ProtectedRoute allowedRoles={['alumno']}><ConocenosAlumno /></ProtectedRoute>} />
          <Route path="/alumno/inscripcion/:id" element={<ProtectedRoute allowedRoles={['alumno']}><Inscripcion /></ProtectedRoute>} />
          <Route path="/alumno/editarDatos/:id" element={<ProtectedRoute allowedRoles={['alumno']}><EditarDatos /></ProtectedRoute>} />
          <Route path="/alumno/Kardex" element={<ProtectedRoute allowedRoles={['alumno']}><HistorialAcademico /></ProtectedRoute>} />
          <Route
            path="/alumno/MateriasReprobadas"
            element={<ProtectedRoute allowedRoles={['alumno']}><MateriasReprobadas /></ProtectedRoute>}
          />
          <Route
            path="/alumno/datosPersonales/:id"
            element={<ProtectedRoute allowedRoles={['alumno']}><DatosPersonales /></ProtectedRoute>}
          />
          <Route
            path="/alumno/ConsultarCalificaciones"
            element={<ProtectedRoute allowedRoles={['alumno']}><ConsultarCalificaciones /></ProtectedRoute>}
          />
          <Route
            path="/alumno/resenar-profesores"
            element={<ProtectedRoute allowedRoles={['alumno']}><ResenarProfesores /></ProtectedRoute>}
          />
          <Route
            path="/alumno/resenas-profesor/:id"
            element={<ProtectedRoute allowedRoles={['alumno']}><DetalleProfesorResenas /></ProtectedRoute>}
          />
          <Route
            path="/alumno/MapasCurriculares"
            element={<ProtectedRoute allowedRoles={['alumno']}><MapasCurriculares /></ProtectedRoute>}
          />
          {/* PROFESOR */}
          <Route path="/profesor/:id" element={<ProtectedRoute allowedRoles={['profesor']}><Profesor /></ProtectedRoute>} />
          <Route path="/profesor/Chat" element={<ProtectedRoute allowedRoles={['profesor']}><ChatbotProfesor /></ProtectedRoute>} />
          <Route path="/profesor/:id/clases" element={<ProtectedRoute allowedRoles={['profesor']}><ClasesImpartidas /></ProtectedRoute>} />
          <Route path="/profesor/:id/ets" element={<ProtectedRoute allowedRoles={['profesor']}><ETSProfesor /></ProtectedRoute>} />
          <Route path="/profesor/:id/evaluacion" element={<ProtectedRoute allowedRoles={['profesor']}><EvaluacionDocente /></ProtectedRoute>} />
          < Route path="/profesor/paseLista/:id" element={<ProtectedRoute allowedRoles={['profesor']}><PaseLista /></ProtectedRoute>} />
          <Route
            path="/profesor/RegistrarCalificaciones/:id/:periodo"
            element={<ProtectedRoute allowedRoles={['profesor']}><RegistrarCalificaciones /></ProtectedRoute>}
          />
          <Route
            path="/profesor/datosPersonalesProf/:id"
            element={<ProtectedRoute allowedRoles={['profesor']}><DatosPersonales /></ProtectedRoute>}
          />
          <Route
            path="/profesor/informacionPersonal/:id"
            element={<ProtectedRoute allowedRoles={['profesor']}><InformacionPersonal /></ProtectedRoute>}
          />
          <Route
            path="/profesor/editarDatosPersonales/:id"
            element={<ProtectedRoute allowedRoles={['profesor']}><EditarDatosPersonales /></ProtectedRoute>}
          />

          <Route path="/administrador" element={<ProtectedRoute allowedRoles={['administrador']}><Administrador /></ProtectedRoute>} />
          <Route path="/administrador/ETS" element={<ProtectedRoute allowedRoles={['administrador']}><ETS /></ProtectedRoute>} />
          <Route
            path="/administrador/publicarNoticia"
            element={<ProtectedRoute allowedRoles={['administrador']}><PublicarNoticia /></ProtectedRoute>}
          />

          {/* ADMINISTRADOR - CRUD */}
          <Route
            path="/administrador/gestionarAlumnos"
            element={<ProtectedRoute allowedRoles={['administrador']}><GestionarAlumnos /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarAlumnos/registrarAlumno"
            element={<ProtectedRoute allowedRoles={['administrador']}><RegistrarAlumnos /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarAlumnos/editarAlumnos/:id"
            element={<ProtectedRoute allowedRoles={['administrador']}><EditarAlumnos /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarProfesores"
            element={<ProtectedRoute allowedRoles={['administrador']}><GestionarProfesores /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarProfesores/registrarProfesor"
            element={<ProtectedRoute allowedRoles={['administrador']}><RegistrarProfesores /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarProfesores/editarProfesor/:id"
            element={<ProtectedRoute allowedRoles={['administrador']}><EditarProfesores /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarCursos"
            element={<ProtectedRoute allowedRoles={['administrador']}><GestionarCursos /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarCursos/registrarCurso"
            element={<ProtectedRoute allowedRoles={['administrador']}><RegistrarCursos /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarCursos/editarCurso/:id"
            element={<ProtectedRoute allowedRoles={['administrador']}><EditarGrupo /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarCursos/distribucionHorarios/:id"
            element={<ProtectedRoute allowedRoles={['administrador']}><Distribucion /></ProtectedRoute>}
          />
          <Route
            path="/administrador/gestionarAlumnos/inscripcion/:id"
            element={<ProtectedRoute allowedRoles={['administrador']}><InscripcionAdmin /></ProtectedRoute>}
          />
          <Route
            path="administrador/datosMedicos/:id"
            element={<ProtectedRoute allowedRoles={['administrador']}><DatosMedicos /></ProtectedRoute>}
          />

          {/* ADMIN PÁGINAS */}
          <Route path="/administrador/carreras" element={<ProtectedRoute allowedRoles={['administrador']}><Carreras /></ProtectedRoute>} />
          <Route path="/administrador/unidades" element={<ProtectedRoute allowedRoles={['administrador']}><Unidades /></ProtectedRoute>} />
          <Route path="/administrador/Fechas" element={<ProtectedRoute allowedRoles={['administrador']}><GenerarCitas /></ProtectedRoute>} />
          <Route
            path="/administrador/SituacionesEspeciales"
            element={<ProtectedRoute allowedRoles={['administrador']}><SituacionesEspeciales /></ProtectedRoute>}
          />
          <Route path="/error" element={<ErrorView />} />
          <Route path="*" element={<ErrorView />} />
          <Route path="/reglamentos" element={<Reglamentos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// App with AuthProvider wrapper
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
