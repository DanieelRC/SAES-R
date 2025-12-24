// routes/rutaAdministrador.js
const express = require("express");
const bd = require("../../model/modelo");
const { v4: uuidv4 } = require("uuid");
const { Op, INTEGER } = require("sequelize");
const bcrypt = require("bcryptjs");
const { raw } = require("mysql2");
const { truncates } = require("bcryptjs");
const { requireAuth, requireRole } = require("../../middleware/auth");

module.exports = (passport) => {
  const router = express.Router();

  // NO aplicar middleware global aquí porque algunas rutas son compartidas
  // En su lugar, aplicar requireAuth y requireRole a cada ruta individualmente según sea necesario
  router.use(requireAuth);

  // ============================
  //  ADMIN: ESTADÍSTICAS GENERALES
  // ============================
  router.get("/EstadisticasGenerales", async (req, res) => {
    try {
      const now = new Date();

      const [alumnos, profesores, administradores, cursos, proximosEventos] =
        await Promise.all([
          bd.DatosPersonales.count({ where: { tipo_usuario: "alumno" } }),
          bd.DatosPersonales.count({ where: { tipo_usuario: "profesor" } }),
          bd.DatosPersonales.count({
            where: { tipo_usuario: "administrador" },
          }),
          bd.Grupo.count(),
          bd.Avisos.count({
            where: {
              fecha_vencimiento: {
                [Op.gte]: now,
              },
            },
          }),
        ]);

      return res.json({
        alumnos,
        profesores,
        administradores,
        cursos,
        proximosEventos,
      });
    } catch (error) {
      console.error("Error al obtener estadísticas generales: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener estadísticas" });
    }
  });

  router.post("/RegistrarAlumno", async (req, res) => {
    const {
      id,
      nombre,
      apellido_p,
      apellido_m,
      fecha_nacimiento,
      tipo_sangre,
      CURP,
      nacionalidad,
      calle,
      numero_ex,
      numero_in,
      codigo_postal,
      colonia,
      delegacion,
      ciudad,
      telefono,
      correo,
      fotoBase64,
    } = req.body;

    var ano = new Date().getFullYear();
    var numeroAleatorio = Math.floor(100000 + Math.random() * 900000);
    //var id = String(ano) + String(numeroAleatorio);
    const contra = uuidv4().replace(/-/g, "").substring(0, 15);
    console.log(contra);

    carr = await bd.Carrera.findOne({
      where: { nombre: req.body.carreraSeleccionada },
    });
    const salt = await bcrypt.genSalt(10);
    const contraHashed = await bcrypt.hash(contra, salt);
    try {
      // Procesar foto si se envió
      let fotoBuffer = null;
      if (fotoBase64) {
        try {
          const base64Data =
            typeof fotoBase64 === "string" && fotoBase64.includes(",")
              ? fotoBase64.split(",")[1]
              : fotoBase64;
          fotoBuffer = Buffer.from(base64Data, "base64");
        } catch (e) {
          console.warn(
            "No se pudo procesar fotoBase64 en registro, se ignora la foto."
          );
        }
      }

      const crearAlumno = await bd.DatosPersonales.create({
        id: id,
        contrasena: contraHashed,
        tipo_usuario: "alumno",
        nombre: nombre,
        ape_paterno: apellido_p,
        ape_materno: apellido_m,
        fecha_nacimiento: fecha_nacimiento,
        tipo_sangre: tipo_sangre,
        CURP: CURP,
        nacionalidad: nacionalidad,
        calle: calle,
        num_exterior: numero_ex,
        num_interior: numero_in,
        codigo_postal: codigo_postal,
        colonia: colonia,
        delegacion: delegacion,
        ciudad: ciudad,
        telefono: telefono,
        email: correo,
        foto: fotoBuffer,
        carrera: carr.nombre,
        situacion: "activo",
        primera_vez: 1,
      });
      const id_es = uuidv4().replace(/-/g, "").substring(0, 15);
      const crearEstudiante = await bd.Estudiante.create({
        id: id_es,
        id_usuario: crearAlumno.id,
        promedio: 0,
        creditos_disponibles: carr.creditos_iniciales,
        estado_academico: "regular",
      });
      const crearHorario = await bd.Horario.create({
        id: uuidv4().replace(/-/g, "").substring(0, 15),
        id_alumno: id,
      });
      const crearKardex = await bd.Kardex.create({
        id: uuidv4().replace(/-/g, "").substring(0, 15),
        id_alumno: id,
        promedio: 0,
        situacion_academica: "regular",
        semestres_restantes: carr.duracion_max,
        creditos_obtenidos: 0,
      });

      console.log("Alumno creado: ");

      // 🔵 NUEVO: Enviar correo con credenciales
      try {
        const transporter = require("nodemailer").createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: correo,
          subject: "Bienvenido al Sistema SAES-R - Credenciales de Acceso",
          html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #7d0024 0%, #5a001a 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a SAES-R!</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hola <strong>${nombre} ${apellido_p} ${apellido_m}</strong>,</p>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                  Tu cuenta de alumno ha sido creada exitosamente en el Sistema SAES-R. A continuación encontrarás tus credenciales de acceso:
                </p>
                
                <!-- Credentials Box -->
                <div style="background: #f5f5f5; border-left: 4px solid #7d0024; padding: 20px; border-radius: 5px; margin: 30px 0;">
                  <p style="color: #333; font-size: 14px; margin: 0 0 15px 0;">
                    <strong>Número de Boleta:</strong> <span style="color: #7d0024; font-size: 16px; font-weight: bold;">${id}</span>
                  </p>
                  <p style="color: #333; font-size: 14px; margin: 0;">
                    <strong>Contraseña temporal:</strong> <span style="color: #7d0024; font-size: 16px; font-weight: bold;">${contra}</span>
                  </p>
                </div>

                <!-- Info Box -->
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="color: #856404; font-size: 13px; margin: 0;">
                    <strong>Importante:</strong> Por seguridad, se te solicitara cambiar de contraseña en tu primer inicio de sesión.
                  </p>
                </div>

                <!-- Info -->
                <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="color: #1565c0; font-size: 13px; margin: 0;">
                    <strong>Carrera:</strong> ${carr.nombre}
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  Sistema Automatizado de Administración Escolar Renovado<br>
                  ESCOM - IPN
                </p>
              </div>
            </div>
          </body>
          </html>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo de credenciales enviado a:", correo);
      } catch (emailError) {
        console.error("Error al enviar correo de credenciales:", emailError);
        // No detener el registro si falla el envío del correo
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error al crear el alumno: ", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear el alumno" });
      return;
    }
  });

  router.get("/ObtenerGrupo/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const grupo = await bd.Grupo.findOne({
        where: { id: id },
        raw: true,
        nest: true,
      });
      console.log("Grupo obtenido: ", grupo);
      return res.json({ grupo: grupo });
    } catch (error) {
      console.error("Error al obtener la informacion del grupo: ", error);
    }
  });

  router.put("/EditarGrupo/:id", async (req, res) => {
    const { id } = req.body;
    const { id_prof, id_ua, turno, nombre, salon } = req.body;
    console.log("Datos recibidos para editar el grupo: ", req.body);
    console.log("ID del grupo a editar: ", id);
    console.log("Tipo de ID:", typeof id, "Valor:", id);
    const id2 = id;
    let turn = "";
    if (turno == "Matutino") {
      turn = "M";
    } else {
      turn = "V";
    }

    const semes = await bd.Unidad_Aprendizaje.findOne({
      where: { id: id_ua },
    });
    let val = await bd.Grupo.count({
      where: { id_ua: id_ua, turno: turno },
    });
    console.log("Valor de val: ", val);
    const pref = await bd.Carrera.findOne({
      where: { nombre: semes.carrera },
    });
    try {
      const actualizarGrupo = await bd.Grupo.update(
        {
          nombre: nombre,
          id_ua: id_ua,
          id_prof: id_prof,
          turno: turno,
          salon: salon,
        },
        { where: { id: id2 } }
      );

      console.log("Grupo actualizado: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al actualizar el grupo: ", error);
    }
  });
  router.post("/RegistrarProfesor", async (req, res) => {
    const {
      grado,
      nombre,
      apellido_p,
      apellido_m,
      fecha_nacimiento,
      tipo_sangre,
      CURP,
      nacionalidad,
      calle,
      numero_ex,
      numero_in,
      codigo_postal,
      colonia,
      delegacion,
      ciudad,
      telefono,
      correo,
      RFC,
      fotoBase64,
    } = req.body;
    const contra = uuidv4().replace(/-/g, "").substring(0, 15);
    try {
      console.log(contra);
      const salt = await bcrypt.genSalt(10);
      const contraHashed = await bcrypt.hash(contra, salt);

      // Procesar foto si se envió
      let fotoBuffer = null;
      if (fotoBase64) {
        try {
          const base64Data =
            typeof fotoBase64 === "string" && fotoBase64.includes(",")
              ? fotoBase64.split(",")[1]
              : fotoBase64;
          fotoBuffer = Buffer.from(base64Data, "base64");
        } catch (e) {
          console.warn(
            "No se pudo procesar fotoBase64 en registro de profesor, se ignora la foto."
          );
        }
      }

      const CrearProfesor = await bd.DatosPersonales.create({
        id: RFC,
        contrasena: contraHashed,
        tipo_usuario: "profesor",
        nombre: nombre,
        ape_paterno: apellido_p,
        ape_materno: apellido_m,
        fecha_nacimiento: fecha_nacimiento,
        RFC: RFC,
        tipo_sangre: tipo_sangre,
        CURP: CURP,
        nacionalidad: nacionalidad,
        calle: calle,
        num_exterior: numero_ex,
        num_interior: numero_in,
        codigo_postal: codigo_postal,
        colonia: colonia,
        delegacion: delegacion,
        ciudad: ciudad,
        telefono: telefono,
        email: correo,
        foto: fotoBuffer,
        grado: grado,
        situacion: "activo",
        primera_vez: 1,
      });

      console.log("Profesor creado: ");

      // 🔵 NUEVO: Enviar correo con credenciales
      try {
        const transporter = require("nodemailer").createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: correo,
          subject: "Bienvenido al Sistema SAES-R - Credenciales de Acceso",
          html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #7d0024 0%, #5a001a 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a SAES-R!</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hola <strong>${grado} ${nombre} ${apellido_p} ${apellido_m}</strong>,</p>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                  Tu cuenta de profesor ha sido creada exitosamente en el Sistema SAES-R. A continuación encontrarás tus credenciales de acceso:
                </p>
                
                <!-- Credentials Box -->
                <div style="background: #f5f5f5; border-left: 4px solid #7d0024; padding: 20px; border-radius: 5px; margin: 30px 0;">
                  <p style="color: #333; font-size: 14px; margin: 0 0 15px 0;">
                    <strong>RFC:</strong> <span style="color: #7d0024; font-size: 16px; font-weight: bold;">${RFC}</span>
                  </p>
                  <p style="color: #333; font-size: 14px; margin: 0;">
                    <strong>Contraseña temporal:</strong> <span style="color: #7d0024; font-size: 16px; font-weight: bold;">${contra}</span>
                  </p>
                </div>

                <!-- Info Box -->
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="color: #856404; font-size: 13px; margin: 0;">
                    <strong>Importante:</strong> Por seguridad, se te solicitara cambiar de contraseña en tu primer inicio de sesión.
                  </p>
                </div>

                <!-- Access Info -->
                <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="color: #2e7d32; font-size: 13px; margin: 0;">
                    Ya puedes acceder al sistema SAES-R con tus credenciales y comenzar a gestionar tus grupos y calificaciones.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  Sistema Automatizado de Administración Escolar Renovado<br>
                  ESCOM - IPN
                </p>
              </div>
            </div>
          </body>
          </html>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo de credenciales enviado a:", correo);
      } catch (emailError) {
        console.error("Error al enviar correo de credenciales:", emailError);
        // No detener el registro si falla el envío del correo
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error al crear el profesor: ", error);
    }
  });

  router.get("/ObtenerProfesores", async (req, res) => {
    try {
      const profesores = await bd.DatosPersonales.findAll({
        where: { tipo_usuario: "profesor" },
      });
      return res.json({ profesores: profesores });
    } catch (error) {
      console.error("Error al obtener los alumnos: ", error);
    }
  });

  router.get("/ObtenerAlumno/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const alumno = await bd.DatosPersonales.findOne({
        where: { id: id, tipo_usuario: "alumno" },
        raw: true,
        nest: true,
      });
      return res.json({ alumno: alumno });
    } catch (error) {
      console.error("Error al obtener la informacion del alumno: ", error);
    }
  });

  router.delete("/EliminarCurso/:id", async (req, res) => {
    const { id } = req.params;
    console.log("ID a eliminar: ", id);
    try {
      const eliminar_relacionados = await bd.Distribucion.destroy({
        where: { id_grupo: id },
      });
      const eliminarCurso = await bd.Grupo.destroy({
        where: { id: id },
      });
      console.log("Curso eliminado: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al eliminar el curso: ", error);
    }
  });

  router.get("/ObtenerDist/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const distribucion = await bd.Distribucion.findAll({
        where: { id_grupo: id },
        raw: true,
        nest: true,
      });
      return res.json({ Distri: distribucion });
    } catch (error) {
      console.error("Error al obtener la distribucion: ", error);
    }
  });

  router.post("/AgregarDist/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { id_grupo, dia, hora_ini, hora_fin } = req.body;

      console.log("REQ PARAMS:", req.params);
      console.log("REQ BODY:", req.body);

      const grupoActual = await bd.Grupo.findOne({
        where: { id: id_grupo },
      });

      if (!grupoActual) {
        return res.json({ success: false, message: "Grupo no encontrado" });
      }

      const gruposMismoNombre = await bd.Grupo.findAll({
        where: { nombre: grupoActual.nombre },
        attributes: ["id"], // solo necesitamos los ids
      });

      const idsGrupos = gruposMismoNombre.map((g) => g.id);

      //  Buscar distribuciones de esos grupos en el mismo día
      const distribuciones = await bd.Distribucion.findAll({
        where: {
          id_grupo: { [Op.in]: idsGrupos },
          dia: dia,
        },
      });

      //  Validar traslape de horarios
      const conflicto = distribuciones.some((dist) => {
        // Convertimos a minutos para comparar fácilmente
        const [ini1h, ini1m] = dist.hora_ini.split(":").map(Number);
        const [fin1h, fin1m] = dist.hora_fin.split(":").map(Number);
        const [ini2h, ini2m] = hora_ini.split(":").map(Number);
        const [fin2h, fin2m] = hora_fin.split(":").map(Number);

        const ini1 = ini1h * 60 + ini1m;
        const fin1 = fin1h * 60 + fin1m;
        const ini2 = ini2h * 60 + ini2m;
        const fin2 = fin2h * 60 + fin2m;

        // hay traslape si se intersectan los intervalos
        return ini2 < fin1 && fin2 > ini1;
      });

      if (conflicto) {
        return res.json({
          success: false,
          message:
            "Horario ocupado: ya existe una distribución que se traslapa.",
        });
      }

      const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
      await bd.Distribucion.create({
        id: id2,
        id_grupo: id_grupo,
        dia: dia,
        hora_ini: hora_ini,
        hora_fin: hora_fin,
      });

      res.json({
        success: true,
        message: "Distribución agregada correctamente",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error en el servidor" });
    }
  });

  router.get("/ObtenerProfesor/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const profesor = await bd.DatosPersonales.findOne({
        where: { id: id, tipo_usuario: "profesor" },
        raw: true,
        nest: true,
      });
      return res.json({ profesor: profesor });
    } catch (error) {
      console.error("Error al obtener la informacion del profesor: ", error);
    }
  });

  router.put("/EditarAlumno/:id", async (req, res) => {
    const { id } = req.params;
    const {
      nombre,
      ape_paterno,
      ape_materno,
      fecha_nacimiento,
      tipo_sangre,
      CURP,
      nacionalidad,
      calle,
      num_exterior,
      num_interior,
      codigo_postal,
      colonia,
      delegacion,
      ciudad,
      telefono,
      email,
      carrera,
    } = req.body;
    try {
      const fields = {
        nombre,
        ape_paterno,
        ape_materno,
        fecha_nacimiento,
        tipo_sangre,
        CURP,
        nacionalidad,
        calle,
        num_exterior,
        num_interior,
        codigo_postal,
        colonia,
        delegacion,
        ciudad,
        telefono,
        email,
        carrera,
      };

      if (req.body.fotoBase64) {
        try {
          const base64Data =
            typeof req.body.fotoBase64 === "string" &&
              req.body.fotoBase64.includes(",")
              ? req.body.fotoBase64.split(",")[1]
              : req.body.fotoBase64;
          fields.foto = Buffer.from(base64Data, "base64");
        } catch (e) {
          console.warn("No se pudo procesar fotoBase64, ignorando campo foto.");
        }
      }

      await bd.DatosPersonales.update(fields, {
        where: { id: id, tipo_usuario: "alumno" },
      });
      console.log("Alumno actualizado: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al actualizar el alumno: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al actualizar el alumno" });
    }
  });

  // Obtener foto de alumno en binario para consumo en otras vistas
  router.get("/Alumno/Foto/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const alumno = await bd.DatosPersonales.findOne({
        attributes: ["foto"],
        where: { id: id, tipo_usuario: "alumno" },
        raw: true,
      });
      if (!alumno || !alumno.foto) {
        return res.status(404).send("Foto no encontrada");
      }
      res.setHeader("Content-Type", "image/jpeg");
      return res.end(alumno.foto);
    } catch (e) {
      console.error("Error al obtener foto del alumno:", e);
      return res.status(500).send("Error interno");
    }
  });

  // Obtener foto de profesor en binario para consumo en otras vistas
  router.get("/Profesor/Foto/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const profesor = await bd.DatosPersonales.findOne({
        attributes: ["foto"],
        where: { id: id, tipo_usuario: "profesor" },
        raw: true,
      });
      if (!profesor || !profesor.foto) {
        return res.status(404).send("Foto no encontrada");
      }
      res.setHeader("Content-Type", "image/jpeg");
      return res.end(profesor.foto);
    } catch (e) {
      console.error("Error al obtener foto del profesor:", e);
      return res.status(500).send("Error interno");
    }
  });

  router.delete("/EliminarDist/:id", async (req, res) => {
    const { id } = req.params;
    console.log("ID a eliminar: ", id);
    try {
      const eliminarDist = await bd.Distribucion.destroy({
        where: { id: id },
      });
      console.log("Distribucion eliminada: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al eliminar la distribucion: ", error);
    }
  });
  router.put("/EditarProfesor/:id", async (req, res) => {
    const { id } = req.params;
    const {
      nombre,
      ape_paterno,
      ape_materno,
      fecha_nacimiento,
      tipo_sangre,
      CURP,
      nacionalidad,
      calle,
      num_exterior,
      num_interior,
      codigo_postal,
      colonia,
      delegacion,
      ciudad,
      telefono,
      email,
      grado,
      RFC,
      fotoBase64,
    } = req.body;
    try {
      const fields = {
        nombre,
        ape_paterno,
        ape_materno,
        fecha_nacimiento,
        tipo_sangre,
        CURP,
        nacionalidad,
        calle,
        num_exterior,
        num_interior,
        codigo_postal,
        colonia,
        delegacion,
        ciudad,
        telefono,
        email,
        grado,
      };

      if (fotoBase64) {
        try {
          const base64Data =
            typeof fotoBase64 === "string" && fotoBase64.includes(",")
              ? fotoBase64.split(",")[1]
              : fotoBase64;
          fields.foto = Buffer.from(base64Data, "base64");
        } catch (e) {
          console.warn(
            "No se pudo procesar fotoBase64 en edición de profesor, se ignora la foto."
          );
        }
      }

      const actualizarProfesor = await bd.DatosPersonales.update(fields, {
        where: { id: id, tipo_usuario: "profesor" },
      });
      console.log("Profesor actualizado: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al actualizar el profesor: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al actualizar el profesor" });
    }
  });
  router.get("/ObtenerCursos", async (req, res) => {
    try {
      const cursos = await bd.Grupo.findAll({
        include: [
          {
            model: bd.DatosPersonales,
            attributes: ["nombre", "ape_paterno", "ape_materno"],
          },
          {
            model: bd.Unidad_Aprendizaje,
            attributes: [
              "id",
              "nombre",
              "carrera",
              "tipo",
              "credito",
              "semestre",
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      res.json({ cursos: cursos });
    } catch (error) {
      console.error("Error al obtener los cursos: ", error);
      return res.status(500).json({ error: "Error interno al obtener cursos" });
    }
  });
  router.get("/ObtenerCursos/Prof/:id", async (req, res) => {
    const us = req.user.id;
    try {
      const cursos = await bd.Grupo.findAll({
        include: [
          {
            model: bd.DatosPersonales,
            atributes: ["nombre", "ape_paterno", "ape_materno"],
          },
          {
            model: bd.Unidad_Aprendizaje,
            attributes: ["nombre", "carrera", "tipo"],
          },
        ],
        where: { id_prof: us },
        raw: true,
        nest: true,
      });
      const profe = await bd.Grupo.findOne({
        where: { id: "1BM1_UA006" },
        raw: true,
        nest: true,
      });

      res.json({ cursos: cursos });
    } catch (error) {
      console.error("Error al obtener los cursos: ", error);
    }
  });

  router.get("/ObtenerUA", async (req, res) => {
    try {
      const UA = await bd.Unidad_Aprendizaje.findAll();
      return res.json({ UA: UA });
    } catch (error) {
      console.error("Error al obtener las UA: ", error);
    }
  });

  router.get("/ObtenerInscritos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const inscritos = await bd.Mat_Inscritos.findAll({
        where: { id_grupo: id },
        include: [
          { model: bd.Horario, include: [{ model: bd.DatosPersonales }] },
          {
            model: bd.Grupo,
            include: [
              { model: bd.DatosPersonales },
              { model: bd.Unidad_Aprendizaje },
            ],
          },
        ],
        raw: true,
        nest: true,
      });
      return res.json({ inscritos: inscritos });
    } catch (error) {
      console.error("Error al obtener los inscritos: ", error);
      return res
        .status(500)
        .json({ error: "Error interno al obtener inscritos" });
    }
  });

  router.delete("/EliminarAlumno/:id", async (req, res) => {
    const { id } = req.params;
    console.log("ID a eliminar: ", id);
    try {
      const eliminarAlumno = await bd.DatosPersonales.update(
        {
          situacion: "inactivo",
        },
        {
          where: { id: id, tipo_usuario: "alumno" },
        }
      );
      console.log("Alumno eliminado: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al eliminar el alumno: ", error);
    }
  });

  router.delete("/EliminarProfesor/:id", async (req, res) => {
    const { id } = req.params;
    console.log("ID a eliminar: ", id);
    try {
      const eliminarProfesor = await bd.DatosPersonales.update(
        {
          situacion: "inactivo",
        },
        {
          where: { id: id, tipo_usuario: "profesor" },
        }
      );
      console.log("Profesor eliminado: ");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error al eliminar el profesor: ", error);
    }
  });
  router.get("/ObtenerCarreras", async (req, res) => {
    try {
      const carreras = await bd.Carrera.findAll();
      return res.json({ carreras: carreras });
    } catch (error) {
      console.error("Error al obtener las carreras: ", error);
    }
  });
  router.get("/ObtenerAlumnos", async (req, res) => {
    try {
      const alumnos = await bd.DatosPersonales.findAll({
        where: { tipo_usuario: "alumno" },
      });
      return res.json({ alumnos: alumnos });
    } catch (error) {
      console.error("Error al obtener los alumnos: ", error);
    }
  });

  router.post("/RegistrarCurso", async (req, res) => {
    const { id_profesor, id_UA, turno, nombre, carrera, salon } = req.body;
    try {
      let t = "";
      if (turno == "Matutino") {
        t = "M";
      } else {
        t = "V";
      }

      const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
      const carr = await bd.Carrera.findOne({
        where: { nombre: carrera },
      });

      const ua = await bd.Unidad_Aprendizaje.findOne({
        where: { id: id_UA },
      });
      let name2 =
        String(ua.semestre) +
        String(carr.prefijo_grupo) +
        String(t) +
        String(nombre);
      const val = await bd.Grupo.count({
        where: { id_ua: id_UA, nombre: name2 },
      });

      if (val > 0) {
        return res.json({ success: false });
      } else {
        const crearCurso = await bd.Grupo.create({
          id: id2,
          nombre: name2,
          id_ua: id_UA,
          id_prof: id_profesor,
          turno: turno,
          cupo: 30,
          salon: salon,
        });
        console.log("Curso creado: ");
        return res.json({ success: true, id_grupo: id2 });
      }
    } catch (error) {
      console.error("Error al crear el curso: ", error);
    }
  });

  router.get("/ObtenerGETS", async (req, res) => {
    try {
      const p = await bd.FechasRelevantes.findOne();

      console.log(p.periodo);

      const grupos = await bd.ETS_grupo.findAll({
        where: {
          periodo: {
            [Op.like]: p.periodo,
          },
        },
        include: [
          {
            model: bd.Unidad_Aprendizaje,
          },
          {
            model: bd.DatosPersonales,
          },
        ],
        raw: true,
        nest: true,
      });

      return res.json({ grupos });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/Comprobantes/:id", async (req, res) => {
    const id = req.params.id;

    const comprobantes = await bd.ETS.findAll({
      where: { id_grupo: id },
      include: [
        {
          model: bd.Materia_Reprobada,
          include: [
            {
              model: bd.Estudiante,
              include: [bd.DatosPersonales],
            },
          ],
        },
      ],
    });

    const result = comprobantes.map((c) => ({
      ...c.toJSON(),
      comprobante: c.comprobante ? c.comprobante.toString("base64") : null,
    }));

    return res.json({ comprobantes: result });
  });

  router.post("/TerminarSemestre", async (req, res) => {
    const {
      p1_inicio,
      p1_fin,
      p2_inicio,
      p2_fin,
      p3_inicio,
      p3_fin,
      ext_inicio,
      ext_fin,
      eval_inicio,
      eval_fin,
      ets_inicio,
      ets_fin,
      ets_pago_inicio,
      ets_pago_fin,
      ets_cal_inicio,
      ets_cal_fin,
      periodo,
    } = req.body;

    try {
      const aprobados = await bd.Mat_Inscritos.findAll({});

      for (const a of aprobados) {
        const grupo = await bd.Grupo.findOne({
          where: { id: a.id_grupo },
          include: [{ model: bd.Unidad_Aprendizaje }],
        });

        // Validar que el grupo y su UA existan
        if (!grupo || !grupo.Unidad_Aprendizaje) {
          console.warn(
            `Inscripción ${a.id} (Grupo ${a.id_grupo}) ignorada: Grupo o UA no encontrados.`
          );
          continue;
        }

        // Obtener alumno desde horario -> DatosPersonales -> Estudiante
        const datos = await bd.DatosPersonales.findOne({
          include: [
            {
              model: bd.Horario,
              where: { id: a.id_horario },
              required: true,
            },
          ],
        });

        if (!datos) {
          console.warn(
            `Inscripción ${a.id} ignorada: No se encontraron datos personales para el horario ${a.id_horario}.`
          );
          continue;
        }

        // Id del estudiante real
        const idEst = datos.id;

        // Calificación final
        let calificacion = 0;
        if (parseFloat(a.calificacion_final) >= 6) {
          calificacion = parseFloat(a.calificacion_final);
        } else if (parseFloat(a.extra) >= 6) {
          calificacion = parseFloat(a.extra);
        }

        // Obtener estudiante
        const est = await bd.Estudiante.findOne({
          where: { id_usuario: idEst },
        });

        if (!est) {
          console.warn(
            `Inscripción ${a.id} ignorada: No se encontró registro de estudiante para el usuario ${idEst}.`
          );
          continue;
        }

        // Actualizar estudiante
        await est.update({
          promedio: (parseFloat(est.promedio) + calificacion) / 2,
          creditos_disponibles: 50,
        });

        // Obtener kardex del alumno
        const kardex = await bd.Kardex.findOne({
          where: { id_alumno: datos.id },
        });

        if (!kardex) {
          console.warn(
            `Inscripción ${a.id} ignorada: No se encontró kardex para el alumno ${datos.id}.`
          );
          continue;
        }

        // Actualizar kardex
        await kardex.update({
          promedio: (parseFloat(kardex.promedio) + calificacion) / 2,
          creditos_obtenidos:
            parseFloat(kardex.creditos_obtenidos) +
            parseFloat(grupo.Unidad_Aprendizaje.credito),
        });
      }

      await bd.Lista.destroy({ where: {} });
      await bd.Borrador_Horario.destroy({ where: {} });
      await bd.Inscripcion.destroy({ where: {} });
      await bd.Mat_Inscritos.destroy({ where: {} });
      await bd.Distribucion.destroy({ where: {} });
      await bd.Grupo.destroy({ where: {} });

      await bd.Materia_Reprobada.increment(
        { periodos_restantes: -1 },
        { where: {} }
      );

      await bd.Materia_Reprobada.update(
        {
          estado_actual: "Desfasada",
        },
        { where: { periodos_restantes: { [Op.lte]: 0 } } }
      );

      await bd.Kardex.increment({ semestres_restantes: -1 }, { where: {} });

      await bd.Kardex.update(
        { situacion_academica: "Periodos disponibles agotados" },
        { where: { semestres_restantes: { [Op.lte]: 0 } } }
      );

      const alumnosConKardex = await bd.DatosPersonales.findAll({
        include: [
          {
            model: bd.Kardex,
            where: {
              semestres_restantes: { [Op.lte]: 0 },
            },
            required: true,
          },
        ],
      });

      // Extraer solo los IDs de estudiante
      const idsEstudiantes = alumnosConKardex.map((a) => a.id);

      // Actualizar el estado académico en Estudiante
      await bd.Estudiante.update(
        { estado_academico: "Periodos disponibles agotados" },
        { where: { id_usuario: idsEstudiantes } }
      );

      const registro = await bd.FechasRelevantes.findOne();
      await registro.update({
        registro_primer_parcial: p1_inicio,
        fin_registro_primer_parcial: p1_fin,
        registro_segundo_parcial: p2_inicio,
        fin_registro_segundo_parcial: p2_fin,
        registro_tercer_parcial: p3_inicio,
        fin_registro_tercer_parcial: p3_fin,
        registro_extra: ext_inicio,
        fin_registro_extra: ext_fin,
        evalu_profe: eval_inicio,
        fin_evalu_profe: eval_fin,
        inscribir_ets: ets_inicio,
        fin_inscribir_ets: ets_fin,
        subir_doc_ets: ets_pago_inicio,
        fin_subir_doc_ets: ets_pago_fin,
        eval_ets: ets_cal_inicio,
        fin_evalu_ets: ets_cal_fin,
        periodo: periodo,
      });
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  });

  router.post("/Validar/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const ets = await bd.ETS.findOne({
        where: { id: id },
        include: [
          {
            model: bd.Materia_Reprobada,
            include: [
              {
                model: bd.Estudiante,
                include: [bd.DatosPersonales],
              },
            ],
          },
          {
            model: bd.ETS_grupo,
            include: [bd.Unidad_Aprendizaje],
          },
        ],
      });

      if (!ets) {
        return res
          .status(404)
          .json({ success: false, message: "ETS no encontrado" });
      }

      const etsJSON = ets.toJSON();
      await bd.ETS.update({ validado: 1 }, { where: { id: id } });

      // FIX: Usar DatosPersonale (sin 's')
      if (
        !etsJSON.Materia_Reprobada ||
        !etsJSON.Materia_Reprobada.Estudiante ||
        !etsJSON.Materia_Reprobada.Estudiante.DatosPersonale
      ) {
        console.error("Error: No se pudo acceder a los datos del alumno");
        console.log("Materia_Reprobada:", etsJSON.Materia_Reprobada);
        return res.status(500).json({
          success: false,
          message: "Error al obtener datos del alumno",
        });
      }

      const grupoETS = etsJSON.ETS_grupo || etsJSON.ETS_Grupo;

      if (!grupoETS || !grupoETS.Unidad_Aprendizaje) {
        console.error("Error: No se pudo acceder a los datos del grupo ETS");
        return res.status(500).json({
          success: false,
          message: "Error al obtener datos del grupo ETS",
        });
      }

      // FIX: Usar DatosPersonale (sin 's')
      const alumno = etsJSON.Materia_Reprobada.Estudiante.DatosPersonale;
      const unidad = grupoETS.Unidad_Aprendizaje;

      const transporter = require("nodemailer").createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: alumno.email,
        subject: "Comprobante de Pago ETS Validado - SAES-R",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7d0024 0%, #5a001a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Comprobante ETS Validado</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hola <strong>${alumno.nombre} ${alumno.ape_paterno}</strong>,</p>
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                Tu comprobante de pago para el Examen a Título de Suficiencia (ETS) ha sido validado exitosamente.
              </p>
              
              <!-- Success Box -->
              <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 5px; margin: 30px 0;">
                <p style="color: #2e7d32; font-size: 14px; margin: 0 0 10px 0;">
                  <strong>Unidad de Aprendizaje:</strong> ${unidad.nombre}
                </p>
                <p style="color: #2e7d32; font-size: 14px; margin: 0;">
                  Tu inscripción al ETS ha sido confirmada.
                </p>
              </div>
              
              <!-- Info -->
              <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #1565c0; font-size: 13px; margin: 0;">
                  <strong>Nota:</strong> Recuerda revisar la fecha, hora y lugar del examen en el sistema SAES-R.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Sistema SAES-R<br>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      };

      console.log("Enviando correo a:", mailOptions.to);
      await transporter.sendMail(mailOptions);
      console.log("Correo enviado exitosamente");

      return res.json({ success: true });
    } catch (err) {
      console.error("Error al validar ETS:", err);
      console.error("Stack trace:", err.stack);
      return res
        .status(500)
        .json({ success: false, message: "Error al validar el ETS" });
    }
  });

  router.post("/Denegar/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const ets = await bd.ETS.findOne({
        where: { id: id },
        include: [
          {
            model: bd.Materia_Reprobada,
            include: [
              {
                model: bd.Estudiante,
                include: [bd.DatosPersonales],
              },
            ],
          },
          {
            model: bd.ETS_grupo,
            include: [bd.Unidad_Aprendizaje],
          },
        ],
      });

      if (!ets) {
        return res
          .status(404)
          .json({ success: false, message: "ETS no encontrado" });
      }

      const etsJSON = ets.toJSON();
      await bd.ETS.update(
        {
          validado: 0,
          comprobante: null,
        },
        { where: { id: id } }
      );

      if (
        !etsJSON.Materia_Reprobada ||
        !etsJSON.Materia_Reprobada.Estudiante ||
        !etsJSON.Materia_Reprobada.Estudiante.DatosPersonale
      ) {
        console.error("Error: No se pudo acceder a los datos del alumno");
        console.log("Materia_Reprobada:", etsJSON.Materia_Reprobada);
        return res.status(500).json({
          success: false,
          message: "Error al obtener datos del alumno",
        });
      }

      const grupoETS = etsJSON.ETS_grupo || etsJSON.ETS_Grupo;

      if (!grupoETS || !grupoETS.Unidad_Aprendizaje) {
        console.error("Error: No se pudo acceder a los datos del grupo ETS");
        console.log("Valor de ETS_grupo:", etsJSON.ETS_grupo);
        console.log("Valor de ETS_Grupo:", etsJSON.ETS_Grupo);
        console.log("grupoETS completo:", grupoETS);
        return res.status(500).json({
          success: false,
          message: "Error al obtener datos del grupo ETS",
        });
      }

      const alumno = etsJSON.Materia_Reprobada.Estudiante.DatosPersonale;
      const unidad = grupoETS.Unidad_Aprendizaje;
      const transporter = require("nodemailer").createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: alumno.email,
        subject: "Comprobante de Pago ETS Rechazado - SAES-R",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7d0024 0%, #5a001a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Comprobante ETS Rechazado</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hola <strong>${alumno.nombre} ${alumno.ape_paterno}</strong>,</p>
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                Tu comprobante de pago para el Examen a Título de Suficiencia (ETS) ha sido rechazado.
              </p>
              
              <!-- Warning Box -->
              <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 20px; border-radius: 5px; margin: 30px 0;">
                <p style="color: #c62828; font-size: 14px; margin: 0 0 10px 0;">
                  <strong>Unidad de Aprendizaje:</strong> ${unidad.nombre}
                </p>
                <p style="color: #c62828; font-size: 14px; margin: 0;">
                  El comprobante proporcionado no cumple con los requisitos necesarios.
                </p>
              </div>
              
              <!-- Info -->
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #856404; font-size: 13px; margin: 0;">
                  <strong>Acción requerida:</strong> Por favor, sube un nuevo comprobante de pago válido a través del sistema SAES-R. Verifica que el documento sea legible y corresponda al pago correcto.
                </p>
              </div>
              
              <!-- Tips -->
              <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #1565c0; font-size: 13px; margin: 0;">
                  <strong>Consejos:</strong> Asegúrate de que el comprobante incluya todos los datos requeridos y que la imagen sea clara. Si tienes dudas, contacta a administración.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Sistema SAES-R<br>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      };

      console.log("Enviando correo a:", mailOptions.to);
      await transporter.sendMail(mailOptions);

      return res.json({ success: true });
    } catch (err) {
      console.error("Error al denegar ETS:", err);
      console.error("Stack trace:", err.stack);
      return res
        .status(500)
        .json({ success: false, message: "Error al denegar el ETS" });
    }
  });

  // ============================
  //  OBTENER PROFESORES PARA ETS
  // ============================
  router.get("/ObtenerProfesoresETS", async (req, res) => {
    try {
      const profesores = await bd.DatosPersonales.findAll({
        where: { tipo_usuario: "profesor" },
        attributes: ["id", "nombre", "ape_paterno", "ape_materno"],
      });
      return res.json({ success: true, profesores });
    } catch (err) {
      console.error("Error al obtener profesores:", err);
      return res
        .status(500)
        .json({ success: false, mensaje: "Error al obtener profesores" });
    }
  });

  // ============================
  //  OBTENER UNIDADES DE APRENDIZAJE PARA ETS
  // ============================
  router.get("/ObtenerUnidadesETS", async (req, res) => {
    try {
      const unidades = await bd.Unidad_Aprendizaje.findAll({
        attributes: ["id", "nombre", "credito", "semestre", "carrera"],
      });
      return res.json({ success: true, unidades });
    } catch (err) {
      console.error("Error al obtener unidades:", err);
      return res
        .status(500)
        .json({ success: false, mensaje: "Error al obtener unidades" });
    }
  });

  // ============================
  //  CREAR GRUPO ETS
  // ============================
  router.post("/CrearGrupoETS", async (req, res) => {
    try {
      const { id_ua, id_profesor, turno, hora_inicio, hora_final, fecha } =
        req.body;

      // Validar que todos los campos estén presentes
      if (
        !id_ua ||
        !id_profesor ||
        !turno ||
        !hora_inicio ||
        !hora_final ||
        !fecha
      ) {
        return res.status(400).json({
          success: false,
          mensaje: "Todos los campos son obligatorios",
        });
      }

      // Generar ID único para el grupo ETS
      const id = uuidv4().replace(/-/g, "").substring(0, 15);
      const p = await bd.FechasRelevantes.findOne({});

      if (!p) {
        return res.status(400).json({
          success: false,
          mensaje:
            "No hay fechas relevantes configuradas. Configure el periodo primero.",
        });
      }

      // Crear el grupo ETS
      await bd.ETS_grupo.create({
        id,
        id_ua,
        id_aplicante: id_profesor,
        turno,
        hora_inicio,
        hora_final,
        fecha,
        periodo: p.periodo,
        cupo: 30,
      });

      return res.json({
        success: true,
        mensaje: "Grupo ETS creado exitosamente",
      });
    } catch (err) {
      console.error("Error al crear grupo ETS:", err);
      return res.status(500).json({
        success: false,
        mensaje: "Error al crear el grupo ETS",
      });
    }
  });
  // POST /GenerarCitas
  router.post("/GenerarCitas/:edo", async (req, res) => {
    const { fecha_ini, fecha_fin } = req.body;
    const { edo } = req.params;

    if (!fecha_ini || !fecha_fin) {
      return res
        .status(400)
        .json({ error: "fecha_ini y fecha_fin son requeridos" });
    }

    const val = await bd.Inscripcion.count({
      include: [
        {
          model: bd.DatosPersonales,
          required: true,
          include: [
            {
              model: bd.Estudiante,
              required: true,
              where: { estado_academico: edo },
            },
          ],
        },
      ],
    });

    console.log(val);
    console.log(edo);
    if (val != 0) {
      return res.json({ success: false });
    }
    // VALIDACIÓN DE FECHAS
    // Convertimos a Date solo para comparar validez y orden, pero usaremos los strings para la lógica
    const inicioCheck = new Date(fecha_ini);
    const finCheck = new Date(fecha_fin);

    if (isNaN(inicioCheck) || isNaN(finCheck)) {
      return res.status(400).json({ error: "Formato de fecha inválido" });
    }
    if (inicioCheck > finCheck) {
      return res
        .status(400)
        .json({ error: "fecha_ini debe ser anterior o igual a fecha_fin" });
    }

    try {
      // 1. OBTENER ALUMNOS
      const alumnos = await bd.Estudiante.findAll({
        where: { estado_academico: edo.toLowerCase() },
        order: [["promedio", "DESC"]], // Prioridad por promedio
        raw: true,
      });

      if (!alumnos || alumnos.length === 0) {
        return res
          .status(200)
          .json({ message: "No hay alumnos regulares para generar citas" });
      }

      const nAlumnos = alumnos.length;

      const strIni = new Date(fecha_ini).toISOString().split("T")[0];
      const strFin = new Date(fecha_fin).toISOString().split("T")[0];

      const oneDayMs = 24 * 60 * 60 * 1000;
      // Usamos UTC para calcular la diferencia exacta de días calendario
      const diffTime = new Date(strFin).getTime() - new Date(strIni).getTime();
      const numDias = Math.round(diffTime / oneDayMs) + 1; // +1 porque es inclusivo

      const horasDisponiblesDia = 15; // 07:00 a 22:00
      const minutosDisponiblesDia = horasDisponiblesDia * 60; // 900 minutos
      const minutosTotalesGlobales = numDias * minutosDisponiblesDia;

      // LÓGICA DE DISTRIBUCIÓN
      let intervaloMinutos = minutosTotalesGlobales / nAlumnos;
      let concurrencia = 1; // Alumnos por turno

      // Regla: Si el intervalo es menor a 10 minutos, forzamos 10 min y aumentamos concurrencia
      if (intervaloMinutos < 10) {
        intervaloMinutos = 10;
        // ¿Cuántos slots de 10 minutos caben en todo el periodo?
        const slotsTotalesPosibles = Math.floor(minutosTotalesGlobales / 10);
        // ¿Cuántos alumnos debemos meter en cada slot para que quepan todos?
        concurrencia = Math.ceil(nAlumnos / slotsTotalesPosibles);
      }

      console.log(
        `Configuración: Días: ${numDias}, Alumnos: ${nAlumnos}, Intervalo: ${intervaloMinutos.toFixed(
          2
        )}m, Concurrencia: ${concurrencia}`
      );

      // Función auxiliar para construir fechas sin cambios de zona horaria extraños
      // Toma el string base "YYYY-MM-DD", suma días y establece la hora
      function construirFechaCita(fechaBaseStr, diasASumar, minutosDesdeLas7) {
        const base = new Date(fechaBaseStr);
        // Ajustamos la fecha base sumando los días (en UTC para no perder info)
        base.setUTCDate(base.getUTCDate() + diasASumar);

        // Calculamos hora y minuto
        // Hora inicio es 7 AM.
        const horasExtra = Math.floor(minutosDesdeLas7 / 60);
        const minutosRestantes = Math.floor(minutosDesdeLas7 % 60);

        const horaFinal = 7 + horasExtra;

        // Establecemos la hora. IMPORTANTE: Usamos métodos UTC o Locales consistentemente.
        // Para asegurar que coincida con el backend, asumiremos que queremos guardar la hora local
        // tal cual se leería en el calendario.
        const fechaFinal = new Date(
          base.getUTCFullYear(),
          base.getUTCMonth(),
          base.getUTCDate(),
          horaFinal,
          minutosRestantes,
          0
        );
        return fechaFinal;
      }

      const t = await bd.sequelize.transaction();

      try {
        let currentSlotIndex = 0;
        let alumnosEnEsteSlot = 0;

        for (let i = 0; i < nAlumnos; i++) {
          const alumno = alumnos[i];

          // Calcular en qué minuto global inicia este slot
          const minutosGlobalesInicio = currentSlotIndex * intervaloMinutos;

          // Determinar qué día es (0 es el primer día, 1 el segundo...)
          const diaIndex = Math.floor(
            minutosGlobalesInicio / minutosDisponiblesDia
          );

          // Determinar minutos dentro de ese día (desde las 07:00)
          const minutosEnElDia = minutosGlobalesInicio % minutosDisponiblesDia;

          // Construir fechas
          // Nota: Si nos pasamos de días por redondeo (raro), el Math.floor lo manejará,
          // pero asegúrate de que strIni sea la fecha base correcta.
          const fechaHoraInicio = construirFechaCita(
            strIni,
            diaIndex,
            minutosEnElDia
          );

          // Timespan de 1 hora
          const fechaHoraFin = new Date(
            fechaHoraInicio.getTime() + 60 * 60 * 1000
          );

          let id = uuidv4().replace(/-/g, "").substring(0, 15);

          await bd.Inscripcion.create(
            {
              id,
              id_alumno: alumno.id_usuario,
              fecha_hora_in: fechaHoraInicio,
              fecha_hora_cad: fechaHoraFin,
            },
            { transaction: t }
          );

          // Manejo de concurrencia
          alumnosEnEsteSlot++;
          if (alumnosEnEsteSlot >= concurrencia) {
            // Llenamos este slot, avanzamos al siguiente intervalo de tiempo
            alumnosEnEsteSlot = 0;
            currentSlotIndex++;
          }
        }

        await t.commit();
      } catch (err) {
        await t.rollback();
        throw err;
      }

      return res.status(201).json({
        success: true,
        message: "Citas generadas correctamente",
        totalAlumnos: nAlumnos,
        dias: numDias,
        intervaloMinutos,
        concurrencia,
      });
    } catch (error) {
      console.error("Error GenerarCitas:", error);
      return res.status(500).json({
        error: "Error interno al generar citas",
        details: error.message,
      });
    }
  });

  // ============================
  //  ADMIN: DATOS ALUMNO INSCRIPCIÓN
  // ============================
  router.get("/AdminAlumnoDatos/:idAlumno", async (req, res) => {
    const { idAlumno } = req.params;
    try {
      const alumno = await bd.DatosPersonales.findOne({
        where: { id: idAlumno, tipo_usuario: "alumno" },
      });

      if (!alumno) {
        return res
          .status(404)
          .json({ success: false, error: "Alumno no encontrado" });
      }

      const estudiante = await bd.Estudiante.findOne({
        where: { id_usuario: idAlumno },
      });

      if (!estudiante) {
        return res.status(404).json({
          success: false,
          error: "Registro de estudiante no encontrado para el alumno",
        });
      }

      return res.json({
        success: true,
        alumno: {
          id: alumno.id,
          nombre: alumno.nombre,
          ape_paterno: alumno.ape_paterno,
          ape_materno: alumno.ape_materno,
          carrera: alumno.carrera,
        },
        estudiante: {
          creditos_disponibles: estudiante.creditos_disponibles,
          promedio: estudiante.promedio,
          estado_academico: estudiante.estado_academico,
        },
      });
    } catch (error) {
      console.error("Error en /AdminAlumnoDatos:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener datos del alumno",
      });
    }
  });

  // ============================
  //  ADMIN: MATERIAS INSCRITAS DEL ALUMNO
  // ============================
  router.get("/AdminAlumnoInscripciones/:idAlumno", async (req, res) => {
    const { idAlumno } = req.params;
    try {
      const horario = await bd.Horario.findOne({
        where: { id_alumno: idAlumno },
      });

      if (!horario) {
        return res.json({ success: true, grupos: [] });
      }

      const mats = await bd.Mat_Inscritos.findAll({
        where: { id_horario: horario.id },
        include: [
          {
            model: bd.Grupo,
            attributes: ["id", "nombre", "turno", "cupo"],
            include: [
              {
                model: bd.Unidad_Aprendizaje,
                attributes: [
                  "id",
                  "nombre",
                  "credito",
                  "semestre",
                  "carrera",
                  "tipo",
                ],
              },
              {
                model: bd.DatosPersonales,
                attributes: ["nombre", "ape_paterno", "ape_materno"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      const grupos = mats.map((m) => {
        const g = m.Grupo || {};
        const ua = g.Unidad_Aprendizaje || {};
        const prof = g.DatosPersonale || g.DatosPersonales || {};
        return {
          id_mat_inscrito: m.id,
          id_grupo: g.id,
          grupo: g.nombre,
          turno: g.turno,
          ua: ua.nombre,
          tipo: ua.tipo,
          creditos: ua.credito,
          profesor: `${prof.nombre || ""} ${prof.ape_paterno || ""} ${prof.ape_materno || ""
            }`.trim(),
          cupo: g.cupo,
        };
      });

      return res.json({ success: true, grupos });
    } catch (error) {
      console.error("Error en /AdminAlumnoInscripciones:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener inscripciones del alumno",
      });
    }
  });

  // ============================
  //  ADMIN: INSCRIBIR GRUPO A ALUMNO
  // ============================
  router.post("/AdminAlumnoInscribirGrupo/:idAlumno", async (req, res) => {
    const { idAlumno } = req.params;
    const { idGrupo } = req.body;

    if (!idGrupo) {
      return res
        .status(400)
        .json({ success: false, error: "Falta idGrupo en el cuerpo" });
    }

    try {
      const alumno = await bd.DatosPersonales.findOne({
        where: { id: idAlumno, tipo_usuario: "alumno" },
      });

      if (!alumno) {
        return res
          .status(404)
          .json({ success: false, error: "Alumno no encontrado" });
      }

      const estudiante = await bd.Estudiante.findOne({
        where: { id_usuario: idAlumno },
      });

      if (!estudiante) {
        return res.status(404).json({
          success: false,
          error: "Registro de estudiante no encontrado",
        });
      }

      const horario = await bd.Horario.findOne({
        where: { id_alumno: idAlumno },
      });

      if (!horario) {
        return res.status(404).json({
          success: false,
          error: "Horario no encontrado para el alumno",
        });
      }

      const grupo = await bd.Grupo.findOne({
        where: { id: idGrupo },
        include: [
          {
            model: bd.Unidad_Aprendizaje,
            attributes: [
              "id",
              "nombre",
              "credito",
              "semestre",
              "carrera",
              "tipo",
            ],
          },
          {
            model: bd.Distribucion,
            attributes: ["dia", "hora_ini", "hora_fin"],
          },
        ],
      });

      if (!grupo) {
        return res
          .status(404)
          .json({ success: false, error: "Grupo no encontrado" });
      }

      if (grupo.cupo <= 0) {
        return res.json({
          success: false,
          error: "El grupo no tiene cupo disponible",
        });
      }

      const creditosNecesarios = parseInt(grupo.Unidad_Aprendizaje.credito, 10);
      const creditosDisponibles = parseInt(estudiante.creditos_disponibles, 10);

      if (creditosDisponibles < creditosNecesarios) {
        return res.json({
          success: false,
          error: "El alumno no tiene créditos suficientes",
        });
      }

      // Materias ya inscritas
      const mats = await bd.Mat_Inscritos.findAll({
        where: { id_horario: horario.id },
        include: [
          {
            model: bd.Grupo,
            attributes: ["id", "id_ua"],
            include: [
              {
                model: bd.Unidad_Aprendizaje,
                attributes: ["id", "nombre"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      // Validar que no tenga ya esa UA
      const yaTieneUA = mats.some(
        (m) =>
          m.Grupo &&
          (m.Grupo.id_ua === grupo.id_ua ||
            (m.Grupo.Unidad_Aprendizaje &&
              m.Grupo.Unidad_Aprendizaje.id === grupo.Unidad_Aprendizaje.id))
      );

      if (yaTieneUA) {
        return res.json({
          success: false,
          error: "El alumno ya tiene inscrita esta unidad de aprendizaje",
        });
      }

      // Validar traslapes con distribución
      const idsGruposActuales = mats.map((m) => m.Grupo.id);
      let distribucionesExistentes = [];
      if (idsGruposActuales.length > 0) {
        distribucionesExistentes = await bd.Distribucion.findAll({
          where: { id_grupo: idsGruposActuales },
          raw: true,
        });
      }

      const distribNuevo = (grupo.Distribucions || []).map((d) =>
        d.toJSON ? d.toJSON() : d
      );

      for (const dNuevo of distribNuevo) {
        for (const dExist of distribucionesExistentes) {
          if (seTraslapan(dNuevo, dExist)) {
            return res.json({
              success: false,
              error:
                "El horario del grupo se traslapa con otra materia ya inscrita",
            });
          }
        }
      }

      // Transacción: crear Mat_Inscritos, actualizar cupo y créditos
      const t = await bd.sequelize.transaction();

      try {
        const idMat = uuidv4().replace(/-/g, "").substring(0, 15);

        await bd.Materia_Reprobada.update(
          { recurse: 0 },
          {
            where: {
              id_ua: grupo.id_ua,
              id_estudiante: estudiante.id, // o id_estudiante
            },
          }
        );

        await bd.Mat_Inscritos.create(
          {
            id: idMat,
            id_horario: horario.id,
            id_grupo: idGrupo,
          },
          { transaction: t }
        );

        await bd.Grupo.update(
          { cupo: grupo.cupo - 1 },
          { where: { id: idGrupo }, transaction: t }
        );

        await bd.Estudiante.update(
          {
            creditos_disponibles: creditosDisponibles - creditosNecesarios,
          },
          { where: { id_usuario: idAlumno }, transaction: t }
        );

        await t.commit();

        return res.json({
          success: true,
          message: "Grupo inscrito correctamente",
        });
      } catch (err) {
        await t.rollback();
        console.error("Error en transacción AdminAlumnoInscribirGrupo:", err);
        return res.status(500).json({
          success: false,
          error: "Error al inscribir grupo",
        });
      }
    } catch (error) {
      console.error("Error en /AdminAlumnoInscribirGrupo:", error);
      return res.status(500).json({
        success: false,
        error: "Error al inscribir grupo",
      });
    }
  });

  // ============================
  //  ADMIN: DAR DE BAJA GRUPO A ALUMNO
  // ============================
  router.delete(
    "/AdminAlumnoBajaGrupo/:idAlumno/:idGrupo",
    async (req, res) => {
      const { idAlumno, idGrupo } = req.params;

      try {
        const estudiante = await bd.Estudiante.findOne({
          where: { id_usuario: idAlumno },
        });

        const horario = await bd.Horario.findOne({
          where: { id_alumno: idAlumno },
        });

        if (!estudiante || !horario) {
          return res.status(404).json({
            success: false,
            error: "No se encontró estudiante u horario para el alumno",
          });
        }

        const grupo = await bd.Grupo.findOne({
          where: { id: idGrupo },
          include: [
            {
              model: bd.Unidad_Aprendizaje,
              attributes: ["credito"],
            },
          ],
        });

        if (!grupo) {
          return res.status(404).json({
            success: false,
            error: "Grupo no encontrado",
          });
        }

        const t = await bd.sequelize.transaction();

        try {
          const deleted = await bd.Mat_Inscritos.destroy({
            where: { id_horario: horario.id, id_grupo: idGrupo },
            transaction: t,
          });

          if (!deleted) {
            await t.rollback();
            return res.json({
              success: false,
              error: "El alumno no tenía inscrito ese grupo",
            });
          }

          await bd.Grupo.update(
            { cupo: grupo.cupo + 1 },
            { where: { id: idGrupo }, transaction: t }
          );

          const creditosActuales = parseInt(
            estudiante.creditos_disponibles,
            10
          );
          const creditosUA = parseInt(grupo.Unidad_Aprendizaje.credito, 10);

          await bd.Estudiante.update(
            {
              creditos_disponibles: creditosActuales + creditosUA,
            },
            { where: { id_usuario: idAlumno }, transaction: t }
          );
          const mr = await bd.Materia_Reprobada.findOne({
            where: {
              id_ua: grupo.id_ua,
              id_estudiante: estudiante.id,
            },
          });
          if (mr) {
            await bd.Materia_Reprobada.update(
              { recurse: 1 },
              { where: { id: mr.id }, transaction: t }
            );
          }

          await t.commit();

          return res.json({
            success: true,
            message: "Grupo dado de baja correctamente",
          });
        } catch (err) {
          await t.rollback();
          console.error("Error en transacción AdminAlumnoBajaGrupo:", err);
          return res.status(500).json({
            success: false,
            error: "Error al dar de baja grupo",
          });
        }
      } catch (error) {
        console.error("Error en /AdminAlumnoBajaGrupo:", error);
        return res.status(500).json({
          success: false,
          error: "Error al dar de baja grupo",
        });
      }
    }
  );

  router.get("/SituacionesEspeciales", async (req, res) => {
    try {
      const alumnos = await bd.DatosPersonales.findAll({
        include: [
          {
            model: bd.Estudiante,
            where: {
              estado_academico: { [Op.notIn]: ["Regular", "Irregular"] },
            },
            required: true,
          },
          {
            model: bd.Kardex,
          },
        ],
        raw: true,
        nest: true,
      });
      const alDes = await bd.DatosPersonales.findAll({
        include: [
          {
            model: bd.Estudiante,
            include: [
              {
                model: bd.Materia_Reprobada,
                where: { estado_actual: "Desfasada" },
                required: true,
              },
            ],
            required: true,
          },
          {
            model: bd.Kardex,
          },
        ],
      });

      return res.json({
        alumnosSinSemestres: alumnos,
        alumnosDesfasados: alDes,
      });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/DesfasadasAl/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const mr = await bd.Materia_Reprobada.findAll({
        include: [
          {
            model: bd.Estudiante,
            where: { id_usuario: id },
            required: true,
          },
          {
            model: bd.Unidad_Aprendizaje,
          },
        ],
        where: { estado_actual: "Desfasada" },
        required: true,
      });

      return res.json({ materiasDes: mr });
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/AutorizarCambiosDesfase", async (req, res) => {
    const { materias, id } = req.body;
    console.log(materias);
    try {
      for (const m of materias) {
        let reinscripcion = 0;

        if (m.reinscripcion == true) {
          reinscripcion = 1;
        }

        await bd.Materia_Reprobada.update(
          {
            periodos_restantes: m.semestresExtra,
            recurse: m.reinscripcion,
            estado_actual: "Dictamen",
          },
          {
            where: { id: m.id },
          }
        );
        await bd.Estudiante.update(
          {
            creditos_disponibles: m.creditosExtra,
            estado_academico: "Dictaminado",
          },
          { where: { id_usuario: id } }
        );
        await bd.Kardex.update(
          {
            situacion_academica: "Dictaminado",
          },
          { where: { id_alumno: id } }
        );
      }
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });
  router.post("/AutorizarCambiosSS", async (req, res) => {
    const { periodosExtra, id } = req.body;

    try {
      const c = await bd.Materia_Reprobada.count({
        include: [
          {
            model: bd.Estudiante,
            where: { id_usuario: id },
            required: true,
          },
        ],
      });
      let tipo;
      if (c > 0) {
        tipo = "Irregular";
      } else {
        tipo = "Regular";
      }
      await bd.Kardex.update(
        {
          semestres_restantes: periodosExtra,
          situacion_academica: tipo,
        },
        { where: { id_alumno: id } }
      );
      await bd.Estudiante.update(
        {
          estado_academico: tipo,
        },
        { where: { id_usuario: id } }
      );
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });

  return router;
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
function seTraslapan(d1, d2) {
  if (!d1 || !d2) return false;
  if (d1.dia !== d2.dia) return false;

  const ini1 = parseInt((d1.hora_ini || "00:00").replace(":", ""), 10);
  const fin1 = parseInt((d1.hora_fin || "00:00").replace(":", ""), 10);
  const ini2 = parseInt((d2.hora_ini || "00:00").replace(":", ""), 10);
  const fin2 = parseInt((d2.hora_fin || "00:00").replace(":", ""), 10);

  if ([ini1, fin1, ini2, fin2].some((x) => isNaN(x))) return false;

  // Se traslapan si uno empieza antes de que el otro termine
  // y termina después de que el otro empieza
  return ini1 < fin2 && ini2 < fin1;
}
