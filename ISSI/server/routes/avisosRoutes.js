const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Avisos } = require("../model/modelo");
const { Op } = require("sequelize");
const { requireAuth, requireRole } = require("../middleware/auth");

// Configurar multer para manejar la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
});

// Crear un nuevo aviso (solo administrador)
router.post(
  "/crear",
  requireAuth,
  requireRole(["administrador"]),
  upload.single("imagen"),
  async (req, res) => {
    try {
      const { titulo, descripcion, objetivo, fecha_vencimiento } = req.body;
      const imagen = req.file ? req.file.buffer : null;

      // Generar ID único para el aviso
      const ultimoAviso = await Avisos.findOne({
        order: [["id", "DESC"]],
      });

      let nuevoId = "AVI0001";
      if (ultimoAviso) {
        const numeroActual = parseInt(ultimoAviso.id.substring(3));
        nuevoId = `AVI${String(numeroActual + 1).padStart(4, "0")}`;
      }

      const nuevoAviso = await Avisos.create({
        id: nuevoId,
        titulo,
        descripcion,
        imagen,
        objetivo,
        fecha_vencimiento,
      });

      res.status(201).json({
        success: true,
        message: "Aviso creado exitosamente",
        aviso: {
          id: nuevoAviso.id,
          titulo: nuevoAviso.titulo,
          descripcion: nuevoAviso.descripcion,
          objetivo: nuevoAviso.objetivo,
          fecha_vencimiento: nuevoAviso.fecha_vencimiento,
        },
      });
    } catch (error) {
      console.error("Error al crear aviso:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el aviso",
        error: error.message,
      });
    }
  }
);

// Obtener todos los avisos vigentes (para administrador)
router.get("/todos", requireAuth, async (req, res) => {
  try {
    const fechaActual = new Date();

    const avisos = await Avisos.findAll({
      where: {
        fecha_vencimiento: {
          [Op.gte]: fechaActual,
        },
      },
      order: [["fecha_vencimiento", "DESC"]],
    });

    const avisosConImagen = avisos.map((aviso) => ({
      id: aviso.id,
      titulo: aviso.titulo,
      descripcion: aviso.descripcion,
      imagen: aviso.imagen
        ? `data:image/jpeg;base64,${aviso.imagen.toString("base64")}`
        : null,
      objetivo: aviso.objetivo,
      fecha_vencimiento: aviso.fecha_vencimiento,
    }));

    res.status(200).json({
      success: true,
      avisos: avisosConImagen,
    });
  } catch (error) {
    console.error("Error al obtener avisos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los avisos",
      error: error.message,
    });
  }
});

// Obtener avisos por objetivo (alumno, profesor, todos)
router.get("/por-objetivo/:objetivo", requireAuth, async (req, res) => {
  try {
    const { objetivo } = req.params;
    const fechaActual = new Date();

    // Buscar avisos que sean para el objetivo específico o para "todos"
    const avisos = await Avisos.findAll({
      where: {
        [Op.and]: [
          {
            fecha_vencimiento: {
              [Op.gte]: fechaActual,
            },
          },
          {
            [Op.or]: [{ objetivo: objetivo }, { objetivo: "todos" }],
          },
        ],
      },
      order: [["fecha_vencimiento", "DESC"]],
    });

    const avisosConImagen = avisos.map((aviso) => ({
      id: aviso.id,
      titulo: aviso.titulo,
      descripcion: aviso.descripcion,
      imagen: aviso.imagen
        ? `data:image/jpeg;base64,${aviso.imagen.toString("base64")}`
        : null,
      objetivo: aviso.objetivo,
      fecha_vencimiento: aviso.fecha_vencimiento,
    }));

    res.status(200).json({
      success: true,
      avisos: avisosConImagen,
    });
  } catch (error) {
    console.error("Error al obtener avisos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los avisos",
      error: error.message,
    });
  }
});

// Eliminar aviso (solo administrador)
router.delete(
  "/:id",
  requireAuth,
  requireRole(["administrador"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const resultado = await Avisos.destroy({
        where: { id },
      });

      if (resultado === 0) {
        return res.status(404).json({
          success: false,
          message: "Aviso no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Aviso eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar aviso:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar el aviso",
        error: error.message,
      });
    }
  }
);

module.exports = router;
