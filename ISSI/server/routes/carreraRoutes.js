// server/routes/carreraRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');

// Importa el modelo desde tu modelo.js (ya exporta Carrera)
const { Carrera } = require('../model/modelo');

// GET: todas las carreras (requiere autenticación)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Carrera.findAll();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET: una carrera por PK (nombre) (requiere autenticación)
router.get('/:nombre', requireAuth, async (req, res) => {
  try {
    const item = await Carrera.findByPk(req.params.nombre);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST: crear carrera (solo administrador)
router.post('/', requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { nombre, creditos_iniciales, prefijo_grupo, duracion_max } = req.body;

    if (!nombre || !prefijo_grupo || creditos_iniciales == null || duracion_max == null) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const created = await Carrera.create({
      nombre,
      creditos_iniciales: Number(creditos_iniciales),
      prefijo_grupo,
      duracion_max: Number(duracion_max),
    });

    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT: actualizar carrera por nombre (solo administrador)
router.put('/:nombre', requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { creditos_iniciales, prefijo_grupo, duracion_max } = req.body;

    const [rows] = await Carrera.update(
      {
        ...(creditos_iniciales != null && { creditos_iniciales: Number(creditos_iniciales) }),
        ...(prefijo_grupo != null && { prefijo_grupo }),
        ...(duracion_max != null && { duracion_max: Number(duracion_max) }),
      },
      { where: { nombre: req.params.nombre } }
    );

    if (!rows) return res.status(404).json({ error: 'No encontrado' });

    const refreshed = await Carrera.findByPk(req.params.nombre);
    res.json(refreshed);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE: eliminar carrera por nombre (solo administrador)
router.delete('/:nombre', requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const rows = await Carrera.destroy({ where: { nombre: req.params.nombre } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
