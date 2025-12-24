// server/routes/uaRoutes.js
const express = require('express');
const router = express.Router();
const { Unidad_Aprendizaje, Carrera } = require('../model/modelo');
const { requireAuth, requireRole } = require('../middleware/auth');

// helper para generar id desde nombre, sin paquetes extras
function slugFromName(nombre = '') {
  return nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .trim().toUpperCase().replace(/\s+/g, '_')        // espacios -> _
    .replace(/[^A-Z0-9_]/g, '');                      // limpia
}

// GET: todas las UAs (requiere autenticación)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Unidad_Aprendizaje.findAll();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET: una UA por id (requiere autenticación)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Unidad_Aprendizaje.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST: crear UA (sin id en body) (solo administrador)
router.post('/', requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const { nombre, credito, carrera, semestre, tipo } = req.body;

    if (!nombre || credito == null || !carrera || semestre == null || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // valida duplicado por nombre
    const dup = await Unidad_Aprendizaje.findOne({ where: { nombre } });
    if (dup) return res.status(400).json({ error: `Ya existe una UA con el nombre '${nombre}'` });

    // valida FK carrera
    const existsCarrera = await Carrera.findByPk(carrera);
    if (!existsCarrera) return res.status(400).json({ error: `La carrera '${carrera}' no existe` });

    // genera id desde nombre
    const id = slugFromName(nombre);
    const created = await Unidad_Aprendizaje.create({
      id,
      nombre,
      credito: Number(credito),
      carrera,
      semestre: Number(semestre),
      tipo,
    });

    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT: actualizar UA por id (valida duplicado si cambia el nombre) (solo administrador)
router.put('/:id', requireAuth, requireRole(['administrador']), async (req, res) => {
  try {
    const current = await Unidad_Aprendizaje.findByPk(req.params.id);
    if (!current) return res.status(404).json({ error: 'No encontrado' });

    const { nombre, credito, carrera, semestre, tipo } = req.body;

    if (nombre && nombre !== current.nombre) {
      const dup = await Unidad_Aprendizaje.findOne({ where: { nombre } });
      if (dup) return res.status(400).json({ error: `Ya existe una UA con el nombre '${nombre}'` });
    }
    if (carrera != null) {
      const existsCarrera = await Carrera.findByPk(carrera);
      if (!existsCarrera) return res.status(400).json({ error: `La carrera '${carrera}' no existe` });
    }

    const [rows] = await Unidad_Aprendizaje.update(
      {
        ...(nombre != null && { nombre }),
        ...(credito != null && { credito: Number(credito) }),
        ...(carrera != null && { carrera }),
        ...(semestre != null && { semestre: Number(semestre) }),
        ...(tipo != null && { tipo }),
      },
      { where: { id: req.params.id } }
    );
    if (!rows) return res.status(404).json({ error: 'No encontrado' });

    const refreshed = await Unidad_Aprendizaje.findByPk(req.params.id);
    res.json(refreshed);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;

