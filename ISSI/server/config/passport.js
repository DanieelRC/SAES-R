const LocalStrategy = require("passport-local").Strategy;
const { DatosPersonales } = require("../model/modelo");

module.exports = function (passport) {
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "id", // Campo esperado en el body
        passwordField: "contrasena",
        passReqToCallback: true,
      },
      async (req, id, contrasena, done) => {
        console.log("Intento de inicio de sesión con ID:", id);
        try {
          const user = await DatosPersonales.findByPk(id);
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          const validPassword = await user.validPassword(contrasena);
          if (!validPassword) {
            console.log("Contraseña incorrecta");
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          return done(null, user);
        } catch (err) {
          console.error("Error en la autenticación:", err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await DatosPersonales.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
