const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { DatosPersonales } = require("../model/modelo");
const bd = require("../model/modelo");

require("dotenv").config();

module.exports = function (passport) {
  const router = express.Router();

  // Configurar Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const tokenStore = new Map();

  // 1. Validar boleta y correo, generar token y enviar email
  router.post("/recuperar-contrasena/enviar-token", async (req, res) => {
    try {
      const { boleta, email } = req.body;

      // Validar que los campos estén presentes
      if (!boleta || !email) {
        return res.status(400).json({
          success: false,
          message: "Boleta y correo electrónico son requeridos",
        });
      }

      // Buscar el usuario por boleta
      const usuario = await DatosPersonales.findByPk(boleta);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "La boleta ingresada no existe en el sistema",
        });
      }

      // Validar que el correo coincida
      if (usuario.email !== email) {
        return res.status(400).json({
          success: false,
          message: "El correo electrónico no corresponde con esta boleta",
        });
      }

      // Generar token corto de 8 caracteres para mostrar al usuario
      const tokenShort = crypto.randomBytes(4).toString("hex").toLowerCase();
      // Generar token completo para validación interna
      const tokenFull = crypto.randomBytes(32).toString("hex").toLowerCase();
      const tokenExpiry = Date.now() + 5 * 60 * 1000;

      // Almacenar usando el token corto como clave
      tokenStore.set(tokenShort, {
        tokenFull,
        boleta,
        email,
        expiry: tokenExpiry,
      });

      console.log(
        "Token guardado - Corto:",
        tokenShort,
        "Completo:",
        tokenFull
      );

      // Enviar correo con el token
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperación de Contraseña - SAES-R",
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
                        <h1 style="color: white; margin: 0; font-size: 28px;">Recuperación de Contraseña</h1>
                      </div>
                      
                      <!-- Content -->
                      <div style="padding: 40px 30px;">
                        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hola <strong>${
                          usuario.nombre
                        }</strong>,</p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                          Recibimos una solicitud para recuperar tu contraseña. Usa el código de verificación a continuación para continuar con el proceso.
                        </p>
                        
                        <!-- Token Box -->
                        <div style="background: #f8f9ff; border-left: 4px solid #7d0024; padding: 20px; border-radius: 5px; margin: 30px 0; text-align: center;">
                          <p style="color: #666; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">Código de Verificación</p>
                          <h2 style="color: #7d0024; font-size: 36px; margin: 10px 0; letter-spacing: 4px; font-weight: bold;">${tokenShort.toUpperCase()}</h2>
                        </div>
                        
                        <!-- Info -->
                        <p style="color: #999; font-size: 12px; text-align: center; margin: 20px 0;">
                          Este código es válido por <strong>5 minutos</strong>
                        </p>
                        
                        <!-- Warning -->
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                          <p style="color: #856404; font-size: 13px; margin: 0;">
                            Si no solicitaste esta recuperación, por favor ignora este mensaje y tu cuenta permanecerá segura.
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

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: `Se ha enviado un código de verificación a ${email}`,
      });
    } catch (error) {
      console.error("Error al enviar email:", error);
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud",
      });
    }
  });

  // 2. Validar token
  router.post("/recuperar-contrasena/validar-token", async (req, res) => {
    try {
      const { boleta, email, token } = req.body;

      if (!token || !boleta || !email) {
        return res.status(400).json({
          success: false,
          message: "Token, boleta y correo son requeridos",
        });
      }

      // Normalizar el token a minúsculas
      const tokenNormalizado = token.toLowerCase();
      console.log("Validando token:", tokenNormalizado);
      console.log("Tokens en store:", Array.from(tokenStore.keys()));

      // Buscar el token en la Map
      const tokenData = tokenStore.get(tokenNormalizado);
      console.log("Datos del token:", tokenData);

      if (!tokenData) {
        return res.status(400).json({
          success: false,
          message: "Token inválido",
        });
      }

      // Validar que el token no haya expirado
      if (Date.now() > tokenData.expiry) {
        tokenStore.delete(tokenNormalizado);
        return res.status(400).json({
          success: false,
          message: "El token ha expirado. Por favor solicita uno nuevo",
        });
      }

      // Validar que los datos coincidan
      if (tokenData.boleta !== boleta || tokenData.email !== email) {
        return res.status(400).json({
          success: false,
          message: "Los datos no coinciden",
        });
      }

      // Token válido - generar token para cambio de contraseña
      const changePasswordToken = crypto
        .randomBytes(32)
        .toString("hex")
        .toLowerCase();
      console.log("Generated changePasswordToken:", changePasswordToken);

      tokenStore.set(changePasswordToken, {
        boleta,
        email,
        type: "change_password",
        expiry: Date.now() + 30 * 60 * 1000, // Válido por 30 minutos
      });

      // Eliminar el token de verificación
      tokenStore.delete(tokenNormalizado);

      return res.status(200).json({
        success: true,
        message: "Token validado correctamente",
        changePasswordToken,
      });
    } catch (error) {
      console.error("Error al validar token:", error);
      return res.status(500).json({
        success: false,
        message: "Error al validar el token",
      });
    }
  });

  // 3. Cambiar contraseña
  router.post("/recuperar-contrasena/cambiar-contrasena", async (req, res) => {
    try {
      const { changePasswordToken, nuevaContrasena, confirmarContrasena } =
        req.body;

      if (!changePasswordToken || !nuevaContrasena || !confirmarContrasena) {
        return res.status(400).json({
          success: false,
          message: "Todos los campos son requeridos",
        });
      }

      if (nuevaContrasena !== confirmarContrasena) {
        return res.status(400).json({
          success: false,
          message: "Las contraseñas no coinciden",
        });
      }

      if (nuevaContrasena.length < 6) {
        return res.status(400).json({
          success: false,
          message: "La contraseña debe tener al menos 6 caracteres",
        });
      }

      const tokenData = tokenStore.get(changePasswordToken);

      if (!tokenData || tokenData.type !== "change_password") {
        return res.status(400).json({
          success: false,
          message: "Token inválido",
        });
      }

      if (Date.now() > tokenData.expiry) {
        tokenStore.delete(changePasswordToken);
        return res.status(400).json({
          success: false,
          message: "El token ha expirado",
        });
      }

      const usuario = await DatosPersonales.findByPk(tokenData.boleta);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      if (usuario.primera_vez == 1) {
        if (usuario.primera_vez == 1) {
          await bd.DatosPersonales.update(
            { primera_vez: 0 },
            { where: { id: tokenData.boleta } }
          );
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

      usuario.contrasena = hashedPassword;
      await usuario.save();

      tokenStore.delete(changePasswordToken);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: tokenData.email,
        subject: "Contraseña Actualizada - SAES-R",
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
                        <h1 style="color: white; margin: 0; font-size: 28px;">Contraseña Actualizada</h1>
                      </div>
                      
                      <!-- Content -->
                      <div style="padding: 40px 30px;">
                        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Hola <strong>${usuario.nombre}</strong>,</p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                          Tu contraseña ha sido actualizada exitosamente. Ya puedes acceder a tu cuenta con la nueva contraseña.
                        </p>
                        
                        <!-- Success Box -->
                        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 5px; margin: 30px 0;">
                          <p style="color: #2e7d32; font-size: 14px; margin: 0;">
                            Tu cuenta está protegida con tu nueva contraseña.
                          </p>
                        </div>
                        
                        <!-- Warning -->
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                          <p style="color: #856404; font-size: 13px; margin: 0;">
                            Si no realizaste este cambio, por favor contacta a administración inmediatamente.
                          </p>
                        </div>
                        
                        <!-- Tips -->
                        <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                          <p style="color: #1565c0; font-size: 13px; margin: 0;">
                            <strong>Recomendación:</strong> Guarda tu contraseña en un lugar seguro y evita compartirla.
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

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      return res.status(500).json({
        success: false,
        message: "Error al cambiar la contraseña",
      });
    }
  });

  return router;
};
