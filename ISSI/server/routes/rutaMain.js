const express = require("express");
const SAES = require("../model/modelo");

module.exports = function (passport) {
  const router = express.Router();

  router.post(
    "/IniciarSesion",
    passport.authenticate("local-login", { failureFlash: true }),
    (req, res) => {
      const user = req.user;

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 3; // 3 horas
      } else {
        req.session.cookie.expires = false;
      }

      if (user.tipo_usuario === "alumno") {
        return res.json({ success: true, tipo_usuario: "alumno", id: user.id });
      } else if (user.tipo_usuario === "profesor") {
        return res.json({ success: true, tipo_usuario: "profesor", id: user.id });
      } else {
        return res.json({ success: true, tipo_usuario: "administrador", id: user.id });
      }
    }
  );

  // Endpoint para cerrar sesión
  router.post("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Error al cerrar sesión"
        });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: "Error al destruir la sesión"
          });
        }
        res.clearCookie('connect.sid'); // Limpiar cookie de sesión
        return res.json({ success: true, message: "Sesión cerrada exitosamente" });
      });
    });
  });

  // Endpoint para verificar el estado de la sesión
  router.get("/session/check", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.json({
        authenticated: true,
        user: {
          id: req.user.id,
          tipo_usuario: req.user.tipo_usuario,
          nombre: req.user.nombre,
          ape_paterno: req.user.ape_paterno,
          ape_materno: req.user.ape_materno
        }
      });
    }
    return res.status(401).json({
      authenticated: false,
      message: "No hay sesión activa"
    });
  });

  return router;
}