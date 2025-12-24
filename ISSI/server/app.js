if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport); // Config de Passport
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const rutaMain = require("./routes/rutaMain.js");
const rutaAdministrador = require("./routes/rutasAdministrador/route.js");
const rutaAlumno = require("./routes/rutasAlumno/route.js");
const rutaProfesor = require("./routes/rutasProfesor/ruta.js");
const rutaEmails = require("./routes/rutaEmails.js");
const carreraRoutes = require("./routes/carreraRoutes");
const uaRoutes = require("./routes/uaRoutes");
const datosMedicosRoutes = require("./routes/datosMedicosRoutes");
const avisosRoutes = require("./routes/avisosRoutes");
const profesorEvaluaciones = require("./routes/api/profesorEvaluaciones");

app.set("port", process.env.PORT || 4000);
// Aumentar límite para permitir imágenes en base64
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
// CORS configurado para permitir credentials
app.use(
  cors({
    origin: true, // Refleja el origen de la petición (permite ngrok, localhost, etc.)
    credentials: true,
  })
);
console.log("Servidor corriendo en puerto", app.get("port"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // No guardar sesión si no hay cambios
    saveUninitialized: false, // No crear sesión hasta que se almacene algo
    cookie: {
      secure: false, // Cambiar a true en producción con HTTPS
      httpOnly: true, // Prevenir acceso desde JavaScript del cliente
      sameSite: 'lax', // Permitir cookies en peticiones entre diferentes puertos de localhost
      maxAge: 1000 * 60 * 60 // 1 hora
    },
  })
);

app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Rutas públicas (no requieren autenticación)
app.use("/", rutaMain(passport));
app.use("/", rutaEmails(passport)); // Rutas de email (recuperar contraseña) - NO requieren auth

// Rutas protegidas (requieren autenticación)
app.use("/", rutaAdministrador(passport));
app.use("/", rutaAlumno(passport));
app.use("/", rutaProfesor(passport));

// monta las rutas API
app.use("/api/carreras", carreraRoutes);
app.use("/api/unidades", uaRoutes);

app.use("/api/datos-medicos", datosMedicosRoutes);
app.use("/api/avisos", avisosRoutes);
app.use("/api/profesor", profesorEvaluaciones);

// Middleware Global de Manejo de Errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
});

app.listen(app.get("port"));
