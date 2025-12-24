const express = require("express");
const router = express.Router();
const { DatosMedicos, Enfermedades } = require("../model/modelo");
const { requireAuth, requireRole } = require("../middleware/auth");

function genId(prefix = "DM") {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}_${Date.now()}_${rand}`;
}

router.get("/:id_usuario", requireAuth, async (req, res) => {
  try {
    const dm = await DatosMedicos.findOne({
      where: { id_usuario: req.params.id_usuario },
    });

    if (!dm) return res.json({ datos: null, enfermedades: [] });

    const enfermedades = await Enfermedades.findAll({
      where: { id_dat_med: dm.id },
      order: [["id", "ASC"]],
    });

    res.json({ datos: dm, enfermedades });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { id_usuario, peso, altura, tipo_sangre, nss } = req.body;
    if (!id_usuario || peso == null || altura == null || !tipo_sangre || !nss) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const existe = await DatosMedicos.findOne({ where: { id_usuario } });
    if (existe) {
      return res.status(400).json({
        error: `Ya existen datos médicos para el usuario ${id_usuario}`,
      });
    }

    const created = await DatosMedicos.create({
      id: genId("DM").slice(0, 15),
      id_usuario,
      peso: Number(peso),
      altura: Number(altura),
      tipo_sangre,
      nss,
    });

    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id_dm", requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { peso, altura, tipo_sangre, nss } = req.body;

    const [rows] = await DatosMedicos.update(
      {
        ...(peso != null && { peso: Number(peso) }),
        ...(altura != null && { altura: Number(altura) }),
        ...(tipo_sangre != null && { tipo_sangre }),
        ...(nss != null && { nss }),
      },
      { where: { id: req.params.id_dm } }
    );

    if (!rows) return res.status(404).json({ error: "No encontrado" });

    const refreshed = await DatosMedicos.findByPk(req.params.id_dm);
    res.json(refreshed);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id_dm/enfermedades", requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion)
      return res.status(400).json({ error: "Falta la descripción" });

    const dm = await DatosMedicos.findByPk(req.params.id_dm);
    if (!dm)
      return res.status(404).json({ error: "Datos médicos no encontrados" });

    const enf = await Enfermedades.create({
      id: genId("ENF").slice(0, 15),
      id_dat_med: dm.id,
      descri: descripcion,
    });

    res.status(201).json(enf);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id_dm/enfermedades/:id_enf", requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion)
      return res.status(400).json({ error: "Falta la descripción" });

    const [rows] = await Enfermedades.update(
      { descri: descripcion },
      { where: { id: req.params.id_enf, id_dat_med: req.params.id_dm } }
    );

    if (!rows) return res.status(404).json({ error: "No encontrado" });

    const refreshed = await Enfermedades.findByPk(req.params.id_enf);
    res.json(refreshed);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:id_dm/enfermedades/:id_enf", requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const rows = await Enfermedades.destroy({
      where: { id: req.params.id_enf, id_dat_med: req.params.id_dm },
    });
    if (!rows) return res.status(404).json({ error: "No encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
