const express = require("express");
const bd = require("../../model/modelo");
const { v4: uuidv4 } = require("uuid");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

// Middleware global: solo requireAuth
router.use(requireAuth);

// GET /api/profesor/:id/evaluaciones
router.get("/:id/evaluaciones", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await bd.Resena.findAll({
      where: { id_profesor: id },
      attributes: ["id", "calificacion", "comentarios", "fecha"],
      order: [["fecha", "DESC"]],
      raw: true,
    });

    // Anonimizar: no devolver id_alumno ni datos del alumno
    const data = rows.map((r) => ({
      id: r.id,
      estrellas: Number(r.calificacion),
      comentario: r.comentarios,
      fecha: r.fecha,
    }));

    return res.json({ success: true, evaluaciones: data });
  } catch (err) {
    console.error("Error obteniendo evaluaciones:", err);
    return res.status(500).json({ success: false, msg: "Error interno" });
  }
});

// POST /api/profesor/:id/evaluaciones
router.post("/:id/evaluaciones", async (req, res) => {
  const { id } = req.params;
  const { id_alumno, calificacion, comentario } = req.body;

  try {
    const newId = uuidv4().replace(/-/g, "").substring(0, 15);
    const periodo = await bd.FechasRelevantes.findOne({ where: {} });
    await bd.Resena.create({
      id: newId,
      id_profesor: id,
      id_alumno: id_alumno || null,
      calificacion: Number(calificacion) || 0,
      comentarios: comentario || null,
      fecha: new Date(),
      periodo: periodo.periodo,
    });

    return res.json({ success: true, id: newId });
  } catch (err) {
    console.error("Error guardando reseña:", err);
    return res
      .status(500)
      .json({ success: false, msg: "Error al guardar reseña" });
  }
});

module.exports = router;
