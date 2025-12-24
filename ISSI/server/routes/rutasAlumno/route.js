const express = require("express");
const bd = require("../../model/modelo");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { raw } = require("mysql2");
const { DatosMedicos, Enfermedades } = require("../../model/modelo");
const {
  requireAuth,
  requireRole,
  requireSelf,
} = require("../../middleware/auth");

module.exports = (passport) => {
  const router = express.Router();

  // Middleware global: solo requireAuth (requireRole se aplica por ruta para evitar conflictos)
  // NOTA: No usar requireRole global porque bloquea rutas compartidas con otros tipos de usuario
  router.use(requireAuth);

  function genId(prefix = "DM") {
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}_${Date.now()}_${rand}`;
  }

  // Nueva ruta: devuelve JSON para que el frontend realice la navegación al Chat
  // Se normaliza la ruta para usar la misma convención de capitalización que el resto
  router.get("/Chat/:id", requireAuth, requireRole(["alumno"]), (req, res) => {
    try {
      const { id } = req.params;
      // Respondemos con JSON en vez de redirigir. El frontend debe usar este JSON para navegar.
      return res.json({
        success: true,
        alumnoId: id,
        path: `/alumno/chat/${id}`,
        message:
          "Navegue en el cliente al path indicado para mostrar la vista de chat",
      });
    } catch (err) {
      console.error("Error en /Alumno/Chat/:id ->", err);
      return res
        .status(500)
        .json({ success: false, error: "Error al obtener datos para el chat" });
    }
  });
  router.get(
    "/ConsultarCalificaciones",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      const us = req.user.id;
      try {
        const h = await bd.Horario.findOne({
          where: { id_alumno: us },
        });
        const cal = await bd.Mat_Inscritos.findAll({
          where: { id_horario: h.id },
          include: [
            {
              model: bd.Grupo,
              include: [
                {
                  model: bd.Unidad_Aprendizaje,
                },
                { model: bd.DatosPersonales },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        return res.json({
          success: true,
          calificaciones: cal.map((c) => ({
            id_grupo: c.Grupo.nombre,
            nombre_ua: c.Grupo.Unidad_Aprendizaje.nombre,
            profesor: `${c.Grupo.DatosPersonale.nombre} ${c.Grupo.DatosPersonale.ape_paterno} ${c.Grupo.DatosPersonale.ape_materno}`,
            calificacion_primer: c.calificacion_primer,
            calificacion_segundo: c.calificacion_segundo,
            calificacion_tercer: c.calificacion_tercer,
            calificacion_final: c.calificacion_final,
            extra: c.extra,
          })),
        });
      } catch (err) {
        return res.json({
          success: false,
          error: "Error al obtener las calificaciones",
        });
      }
    }
  );

  // GET: obtener datos médicos + enfermedades del alumno logueado
  router.get(
    "/alumno/datosMedicos",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      try {
        const id_usuario = req.user.id;

        const datos = await DatosMedicos.findOne({ where: { id_usuario } });
        let enfermedades = [];

        if (datos) {
          enfermedades = await Enfermedades.findAll({
            where: { id_dat_med: datos.id },
            order: [["id", "ASC"]],
          });
        }

        res.json({ datos, enfermedades });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error al obtener datos médicos" });
      }
    }
  );

  // POST: crear o actualizar datos médicos del alumno logueado (upsert)
  router.post(
    "/alumno/datosMedicos",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      try {
        const id_usuario = req.user.id;
        const { peso, altura, tipo_sangre, nss } = req.body;

        if (peso == null || altura == null || !tipo_sangre || !nss) {
          return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        let datos = await DatosMedicos.findOne({ where: { id_usuario } });

        if (!datos) {
          // crear
          datos = await DatosMedicos.create({
            id: genId("DM").slice(0, 15),
            id_usuario,
            peso: Number(peso),
            altura: Number(altura),
            tipo_sangre,
            nss,
          });
        } else {
          // actualizar
          await DatosMedicos.update(
            {
              peso: Number(peso),
              altura: Number(altura),
              tipo_sangre,
              nss,
            },
            { where: { id: datos.id } }
          );
          datos = await DatosMedicos.findByPk(datos.id);
        }

        res.json(datos);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error al guardar datos médicos" });
      }
    }
  );

  // POST: crear enfermedad asociada al alumno logueado
  router.post(
    "/alumno/datosMedicos/enfermedades",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      try {
        const id_usuario = req.user.id;
        const { descripcion } = req.body;

        if (!descripcion) {
          return res.status(400).json({ error: "Falta la descripción" });
        }

        let datos = await DatosMedicos.findOne({ where: { id_usuario } });
        if (!datos) {
          return res
            .status(400)
            .json({ error: "Primero debes registrar tus datos médicos" });
        }

        const enf = await Enfermedades.create({
          id: genId("ENF").slice(0, 15),
          id_dat_med: datos.id,
          descri: descripcion,
        });

        res.status(201).json(enf);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error al crear enfermedad" });
      }
    }
  );

  // PUT: editar enfermedad del alumno logueado
  router.put(
    "/alumno/datosMedicos/enfermedades/:idEnf",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      try {
        const id_usuario = req.user.id;
        const { idEnf } = req.params;
        const { descripcion } = req.body;

        if (!descripcion) {
          return res.status(400).json({ error: "Falta la descripción" });
        }

        const datos = await DatosMedicos.findOne({ where: { id_usuario } });
        if (!datos) {
          return res
            .status(404)
            .json({ error: "Datos médicos no encontrados" });
        }

        const [rows] = await Enfermedades.update(
          { descri: descripcion },
          { where: { id: idEnf, id_dat_med: datos.id } }
        );

        if (!rows) {
          return res.status(404).json({ error: "Enfermedad no encontrada" });
        }

        const enf = await Enfermedades.findByPk(idEnf);
        res.json(enf);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error al actualizar enfermedad" });
      }
    }
  );

  // DELETE: eliminar enfermedad del alumno logueado
  router.delete(
    "/alumno/datosMedicos/enfermedades/:idEnf",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      try {
        const id_usuario = req.user.id;
        const { idEnf } = req.params;

        const datos = await DatosMedicos.findOne({ where: { id_usuario } });
        if (!datos) {
          return res
            .status(404)
            .json({ error: "Datos médicos no encontrados" });
        }

        const rows = await Enfermedades.destroy({
          where: { id: idEnf, id_dat_med: datos.id },
        });

        if (!rows) {
          return res.status(404).json({ error: "Enfermedad no encontrada" });
        }

        res.json({ ok: true });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error al eliminar enfermedad" });
      }
    }
  );

  router.get(
    "/ObtenerHorario/:id",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      try {
        const { id } = req.params;

        const datos = await bd.Horario.findAll({
          where: { id_alumno: id },
          include: [
            {
              model: bd.Mat_Inscritos,
              include: [
                {
                  model: bd.Grupo,
                  attributes: ["nombre", "turno", "id_prof", "salon"],
                  include: [
                    {
                      model: bd.Distribucion,
                      attributes: ["hora_ini", "hora_fin", "dia"],
                    },
                    {
                      model: bd.Unidad_Aprendizaje,
                      attributes: ["nombre"],
                    },
                    {
                      model: bd.DatosPersonales,
                      attributes: ["nombre", "ape_paterno", "ape_materno"],
                    },
                  ],
                },
              ],
            },
          ],
        });

        const materias = [];

        datos.forEach((hor) => {
          hor.Mat_Inscritos.forEach((ins) => {
            const grupo = ins.Grupo;
            const prof = grupo?.DatosPersonale;
            const materia = grupo?.Unidad_Aprendizaje?.nombre;

            const base = {
              salon: grupo?.salon || "Sin salon",
              materia: materia || "Sin materia",
              grupo: grupo?.nombre || "Sin grupo",
              turno: grupo?.turno || "Sin turno",
              id_profesor: grupo?.id_prof || null,
              profesor: prof
                ? `${prof.nombre} ${prof.ape_paterno} ${prof.ape_materno}`
                : "Sin profesor",
              distribuciones: grupo?.Distribucions?.map((d) => ({
                dia: d.dia,
                hora_ini: d.hora_ini,
                hora_fin: d.hora_fin,
              })) || [
                {
                  dia: "Sin día",
                  hora_ini: "",
                  hora_fin: "",
                },
              ],
            };

            materias.push(base);
          });
        });

        const horarioUnificado = Object.values(
          materias.reduce((acc, curr) => {
            const key = `${curr.materia}-${curr.grupo}-${curr.turno}`;
            if (!acc[key]) {
              acc[key] = { ...curr, distribuciones: [] };
            }
            acc[key].distribuciones.push(...curr.distribuciones);
            return acc;
          }, {})
        );
        console.log(horarioUnificado);
        res.json({ horario: horarioUnificado });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener el horario" });
      }
    }
  );

  router.get("/Grupos/:id", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado",
      });
    }

    const us = req.user.id;
    const { id } = req.params;

    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us },
    });

    if (!req.session.tempGrupos) {
      req.session.tempGrupos = [];
      req.session.creditos = parseInt(cre.creditos_disponibles, 10);
    }

    try {
      const carr = await bd.DatosPersonales.findOne({ where: { id } });

      // Aprobadas
      const kardex = await bd.Kardex.findOne({ where: { id_alumno: us } });
      let nombresAprobadas = [];
      if (kardex) {
        const aprobadas = await bd.UA_Aprobada.findAll({
          where: { id_kardex: kardex.id },
        });
        nombresAprobadas = aprobadas.map((a) => a.unidad_aprendizaje);
      }

      // Obtener grupos con UA + profesor
      const grupos = await bd.Grupo.findAll({
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
            where: {
              carrera: carr.carrera,
              nombre: { [Op.notIn]: nombresAprobadas },
            },
          },
          {
            model: bd.DatosPersonales,
            attributes: ["nombre", "ape_paterno", "ape_materno"],
          },
        ],
        raw: true,
        nest: true,
      });

      if (!grupos || grupos.length === 0)
        return res.json({ grupos: [], creditos: req.session.creditos });

      // Obtener distribuciones
      const ids = grupos.map((g) => g.id);

      const distribuciones = await bd.Distribucion.findAll({
        where: { id_grupo: ids },
        attributes: ["id", "id_grupo", "dia", "hora_ini", "hora_fin"],
        raw: true,
      });

      // adjuntar distribuciones igual que ObtenerGrupo
      const gruposConDistrib = grupos.map((g) => {
        const d = distribuciones.filter((x) => x.id_grupo === g.id);
        return { ...g, Distribucion: d };
      });

      return res.json({
        grupos: gruposConDistrib,
        creditos: req.session.creditos,
      });
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });

  router.get("/ObtenerDist/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const Distri = await bd.Distribucion.findAll({
        where: { id_grupo: id },
        attributes: ["dia", "hora_ini", "hora_fin"],
      });
      return res.json({ Distri });
    } catch (error) {
      console.error("Error al obtener la distribucion de horas:", error);
      res.status(500).json({ error: "Error interno" });
    }
  });
  router.get("/ObtenerGrupo", async (req, res) => {
    try {
      // Traer los grupos con datos personales y unidad de aprendizaje
      const cursos = await bd.Grupo.findAll({
        include: [
          {
            model: bd.DatosPersonales,
            attributes: [
              "id",
              "nombre",
              "ape_paterno",
              "ape_materno",
              "calificacion",
            ],
          },
          {
            model: bd.Unidad_Aprendizaje,
            attributes: ["nombre", "carrera", "tipo"],
          },
        ],
        raw: true,
        nest: true,
      });

      // Si no hay cursos, devolver array vacío
      if (!Array.isArray(cursos) || cursos.length === 0) {
        return res.json({ cursos: [] });
      }

      // Obtener todas las distribuciones para los grupos obtenidos en una sola consulta
      const groupIds = cursos.map((c) => c.id);
      const distribuciones = await bd.Distribucion.findAll({
        where: { id_grupo: groupIds },
        attributes: ["id", "id_grupo", "dia", "hora_ini", "hora_fin"],
        raw: true,
      });

      // Adjuntar distribuciones a cada curso
      const cursosConDistrib = cursos.map((c) => {
        const d = distribuciones.filter((x) => x.id_grupo === c.id);
        return { ...c, Distribucion: d };
      });

      res.json({ cursos: cursosConDistrib });
    } catch (error) {
      console.error("Error al obtener los cursos: ", error);
      return res.status(500).json({ error: "Error interno al obtener cursos" });
    }
  });

  router.get("/Alumno/VerHorarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const grupos = await bd.Grupo.findAll({
        attributes: ["id", "nombre", "id_ua", "id_prof", "cupo"],
        include: [
          {
            model: bd.Unidad_Aprendizaje,
            attributes: ["id", "nombre", "tipo"],
          },
          {
            model: bd.DatosPersonales,
            attributes: [
              "id",
              "nombre",
              "ape_paterno",
              "ape_materno",
              "calificacion",
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      console.log("Grupos obtenidos count:", grupos.length);
      const resultado = [];

      for (const g of grupos) {
        console.log("Procesando grupo raw:", g);
        const distribuciones = await bd.Distribucion.findAll({
          where: { id_grupo: g.id },
          attributes: ["dia", "hora_ini", "hora_fin"],
          raw: true,
        });

        console.log(
          `Distribuciones encontradas para grupo ${g.id}:`,
          distribuciones.length
        );

        const dias = {
          Lunes: [],
          Martes: [],
          Miércoles: [],
          Jueves: [],
          Viernes: [],
        };
        distribuciones.forEach((d) => {
          const diaKey =
            d.dia === "Miércoles" || d.dia === "Miércoles"
              ? "Miércoles"
              : d.dia;
          if (dias[diaKey] !== undefined)
            dias[diaKey].push(`${d.hora_ini}-${d.hora_fin}`);
        });

        const datosProf = g.DatosPersonale || g.DatosPersonales || {};
        resultado.push({
          id_grupo: g.id,
          tipo: g.tipo,
          id_ua:
            (g.Unidad_Aprendizaje &&
              (g.Unidad_Aprendizaje.id || g.Unidad_Aprendizaje.ID)) ||
            g.id_ua,
          nombre_ua:
            (g.Unidad_Aprendizaje &&
              (g.Unidad_Aprendizaje.nombre || g.Unidad_Aprendizaje.Nombre)) ||
            "",
          profesor: `${datosProf.nombre || ""} ${datosProf.ape_paterno || ""} ${
            datosProf.ape_materno || ""
          }`.trim(),
          calificacion_profesor: datosProf.calificacion || null,
          cupo: g.cupo,
          dias,
        });
      }

      return res.json({ filas: resultado });
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      return res.status(500).json({ error: "Error interno" });
    }
  });
  router.post("/Agregar/:id", async (req, res) => {
    const { id } = req.params;
    const us = req.user.id;
    console.log(us);

    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us },
    });

    const cuesta = await bd.Grupo.findOne({
      where: { id: id },
      include: [
        {
          model: bd.Unidad_Aprendizaje,
          attributes: ["credito", "tipo", "semestre"],
        },
      ],
      raw: true,
      nest: true,
    });

    // --- VALIDACIÓN DE SEMESTRE ---
    try {
      const alumno = await bd.DatosPersonales.findOne({ where: { id: us } });
      const carrera = alumno.carrera;

      const kardex = await bd.Kardex.findOne({ where: { id_alumno: us } });
      // Si no tiene kardex, asumimos semestre 1
      let nombresAprobadas = [];
      if (kardex) {
        const aprobadas = await bd.UA_Aprobada.findAll({
          where: { id_kardex: kardex.id },
        });
        nombresAprobadas = aprobadas.map((a) => a.unidad_aprendizaje);
      }

      const obligatorias = await bd.Unidad_Aprendizaje.findAll({
        where: { carrera: carrera, tipo: "OBLIGATORIA" },
        order: [["semestre", "ASC"]],
      });

      let semestreActual = 1;
      const maxSemestre =
        obligatorias.length > 0
          ? Math.max(...obligatorias.map((o) => o.semestre))
          : 1;

      for (let i = 1; i <= maxSemestre; i++) {
        const obliSemestre = obligatorias.filter((o) => o.semestre === i);
        // Si no hay obligatorias en este semestre, pasamos al siguiente (aunque raro)
        if (obliSemestre.length === 0) continue;

        const todasAprobadas = obliSemestre.every((o) =>
          nombresAprobadas.includes(o.nombre)
        );
        if (!todasAprobadas) {
          semestreActual = i;
          break;
        }
        // Si llegamos al final y todas están aprobadas, el alumno "está" en el último semestre o egresado
        if (i === maxSemestre) semestreActual = maxSemestre;
      }

      const targetSemestre = cuesta.Unidad_Aprendizaje.semestre;
      const maxPermitido = semestreActual + 3;

      if (targetSemestre > maxPermitido) {
        return res.json({
          success: false,
          err: `No puedes inscribir materias de más de 3 semestres adelante. Tu semestre actual es ${semestreActual}, máximo permitido: ${maxPermitido} (Materia es de ${targetSemestre})`,
          tempGrupo: req.session.tempGrupos || [],
          creditos: req.session.creditos || 0,
        });
      }

      // --- NUEVA VALIDACIÓN DE OPTATIVAS ---
      if (cuesta.Unidad_Aprendizaje.tipo === "OPTATIVA") {
        const semestreMateria = cuesta.Unidad_Aprendizaje.semestre;

        // Contar optativas ya aprobadas del kardex
        let optativasAprobadas6to = 0;
        let optativasAprobadas7mo = 0;

        if (kardex) {
          const aprobadas = await bd.UA_Aprobada.findAll({
            where: { id_kardex: kardex.id },
          });

          for (const ap of aprobadas) {
            const ua = await bd.Unidad_Aprendizaje.findOne({
              where: { nombre: ap.unidad_aprendizaje, carrera: carrera },
            });

            if (ua && ua.tipo === "OPTATIVA") {
              if (ua.semestre === 6) optativasAprobadas6to++;
              if (ua.semestre === 7) optativasAprobadas7mo++;
            }
          }
        }

        // Contar optativas en la sesión temporal
        let optativasSesion6to = 0;
        let optativasSesion7mo = 0;

        if (req.session.tempGrupos && req.session.tempGrupos.length > 0) {
          for (const idGrupo of req.session.tempGrupos) {
            const grupoTemp = await bd.Grupo.findOne({
              where: { id: idGrupo },
              include: [
                {
                  model: bd.Unidad_Aprendizaje,
                  attributes: ["tipo", "semestre"],
                },
              ],
              raw: true,
              nest: true,
            });

            if (grupoTemp && grupoTemp.Unidad_Aprendizaje.tipo === "OPTATIVA") {
              if (grupoTemp.Unidad_Aprendizaje.semestre === 6)
                optativasSesion6to++;
              if (grupoTemp.Unidad_Aprendizaje.semestre === 7)
                optativasSesion7mo++;
            }
          }
        }

        // Calcular totales
        const totalOptativas6to = optativasAprobadas6to + optativasSesion6to;
        const totalOptativas7mo = optativasAprobadas7mo + optativasSesion7mo;

        // Validar límites
        if (semestreMateria === 6) {
          if (totalOptativas6to >= 2) {
            return res.json({
              success: false,
              err: `Ya tienes 2 materias optativas de 6to semestre (${optativasAprobadas6to} cursadas, ${optativasSesion6to} seleccionadas). No puedes agregar más.`,
              tempGrupo: req.session.tempGrupos || [],
              creditos: req.session.creditos || 0,
            });
          }
        } else if (semestreMateria === 7) {
          if (totalOptativas7mo >= 2) {
            return res.json({
              success: false,
              err: `Ya tienes 2 materias optativas de 7mo semestre (${optativasAprobadas7mo} cursadas, ${optativasSesion7mo} seleccionadas). No puedes agregar más.`,
              tempGrupo: req.session.tempGrupos || [],
              creditos: req.session.creditos || 0,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error validando semestre:", error);
      return res.json({
        success: false,
        err: "Error al validar requisitos de semestre",
      });
    }

    if (!req.session.tempGrupos) {
      req.session.tempGrupos = [];
      req.session.creditos = parseInt(cre.creditos_disponibles, 10);
      req.session.horarios = [[[]]];
    }
    if (!req.session.tempGrupos.includes(id)) {
      const gruposActuales = req.session.tempGrupos || [];

      const distribuciones = await bd.Distribucion.findAll({
        attributes: ["dia", "hora_ini", "hora_fin", "id_grupo"],
        where: {
          id_grupo: [...gruposActuales, id],
        },
      });

      let ua_existe = false;
      const distriNuevo = distribuciones.filter((d) => d.id_grupo === id);
      const ua = await bd.Grupo.findOne({ where: { id: id } });

      for (const g of gruposActuales) {
        const distriExistente = distribuciones.filter((d) => d.id_grupo === g);
        const uas = await bd.Grupo.findOne({ where: { id: g } });
        if (uas.id_ua == ua.id_ua) {
          return res.json({
            success: false,
            err: "Ya hay una grupo con la unidad de aprendizaje",
            tempGrupo: req.session.tempGrupos,
            creditos: req.session.creditos,
          });
        } else {
          for (const dis of distriExistente) {
            for (const disNuevo of distriNuevo) {
              if (seTraslapan(dis, disNuevo)) {
                return res.json({
                  success: false,
                  err: `El grupo ${id} se traslapa con el grupo ${g}`,
                  tempGrupo: req.session.tempGrupos,
                  creditos: req.session.creditos,
                });
              }
            }
          }
        }
      }
      if (
        parseInt(req.session.creditos, 10) <
        parseInt(cuesta.Unidad_Aprendizaje.credito, 10)
      ) {
        return res.json({
          success: false,
          tempGrupo: req.session.tempGrupos,
          creditos: req.session.creditos,
          err: "No tienes creditos suficientes",
        });
      } else {
        req.session.creditos =
          parseInt(req.session.creditos, 10) -
          parseInt(cuesta.Unidad_Aprendizaje.credito, 10);

        if (!req.session.horarios) {
          req.session.horarios = [];
        }

        const distribsDelGrupo = distriNuevo.map((d) => ({
          dia: d.dia,
          hora_ini: d.hora_ini,
          hora_fin: d.hora_fin,
        }));
        const index = req.session.tempGrupos.length;
        req.session.horarios[index] = distribsDelGrupo;

        req.session.tempGrupos.push(id);
        console.log(req.session.tempGrupos);
        return res.json({
          success: true,
          tempGrupo: req.session.tempGrupos,
          creditos: req.session.creditos,
          horarios: req.session.horarios, // <-- LO ENVÍAS AL FRONT
        });
      }
    }
  });

  router.get("/Con", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado",
      });
    }

    const us = req.user.id;
    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us },
    });

    // Inicializar sesión si está vacía
    if (!req.session.tempGrupos) {
      req.session.tempGrupos = [];
      req.session.creditos = parseInt(cre.creditos_disponibles, 10);
      req.session.horarios = []; // <--- Inicialización de horarios
    }

    return res.json({
      success: true,
      tempGrupo: req.session.tempGrupos,
      creditos: req.session.creditos,
      horarios: req.session.horarios, // <---- ENVIAMOS HORARIOS
    });
  });

  router.post("/ImportarHorario", async (req, res) => {
    us = req.user.id;

    console.log(us);
    let cred;
    const n = await bd.Borrador_Horario.count({
      where: { id_alumno: us, valido: 1 },
    });
    console.log(n);
    const l = await bd.Borrador_Horario.count({
      where: { id_alumno: us },
    });
    console.log(l);
    if (l > 0) {
      const k = await bd.Borrador_Horario.findAll({
        where: { id_alumno: us, valido: 1 },
      });

      const creditos_necesarios = await bd.Borrador_Horario.sum(
        "creditos_necesarios",
        {
          where: { id_alumno: us, valido: 1 },
        }
      );
      console.log(creditos_necesarios);

      for (const b of k) {
        const c = b.creditos_necesarios;
        const ua_ids = req.session.tempGrupos;

        if (req.session.creditos >= c) {
          if (!req.session.tempGrupos.includes(b.id_grupo)) {
            if (req.session.tempGrupos.length > 0) {
              let hayTraslape = false;

              // Recorre los grupos ya agregados en sesión
              for (const u of ua_ids) {
                const ua1 = await bd.Grupo.findOne({
                  where: { id: u },
                });
                const ua2 = await bd.Grupo.findOne({
                  where: { id: b.id_grupo },
                });

                // Obtiene las distribuciones de ambos grupos
                const dist1 = await bd.Distribucion.findAll({
                  where: { id_grupo: ua1.id },
                });
                const dist2 = await bd.Distribucion.findAll({
                  where: { id_grupo: ua2.id },
                });

                // Verifica si alguna distribución se traslapa
                for (const d1 of dist1) {
                  for (const d2 of dist2) {
                    if (seTraslapan(d1, d2)) {
                      hayTraslape = true;
                      break;
                    }
                  }
                  if (hayTraslape) break;
                }

                // Si hay traslape, no se agrega el grupo y se detiene
                if (hayTraslape) {
                  console.log(
                    `Traslape detectado entre grupo ${ua1.id} y ${ua2.id}`
                  );
                  break;
                }

                // Si no hay traslape y no es la misma UA, se agrega
                if (!(ua1.id_ua == ua2.id_ua)) {
                  req.session.tempGrupos.push(b.id_grupo);
                  req.session.creditos =
                    parseFloat(req.session.creditos) -
                    parseFloat(b.creditos_necesarios);

                  await bd.Borrador_Horario.destroy({
                    where: { id_grupo: b.id_grupo },
                  });
                }
              }

              // Si hubo traslape, no se agrega ni se descuentan créditos
              if (hayTraslape) {
                console.log(`El grupo ${b.id_grupo} no se agregó por traslape`);
                continue;
              }
            } else {
              req.session.tempGrupos.push(b.id_grupo);
              req.session.creditos =
                parseFloat(req.session.creditos) -
                parseFloat(b.creditos_necesarios);
              await bd.Borrador_Horario.destroy({
                where: { id_grupo: b.id_grupo },
              });
            }
          }
        } else {
          return res.json({
            success: false,
            msg: "No se han agregado todas porque no tienes creditos suficientes",
          });
        }
      }

      if (l == n) {
        return res.json({ success: true });
      } else {
        return res.json({
          success: false,
          msg: "No se han agregado todas porque algunos horarios se traslapan",
        });
      }
    } else {
      return res.json({
        success: false,
        fatal: true,
        msg: "NO HAY MATERIAS EN EL BORRADOR DE HORARIO",
      });
    }
  });

  router.post("/Inscribirse", async (req, res) => {
    if (req.session.tempGrupos.length === 0) {
      return res.json({
        success: false,
        message: "No tienes materias seleccionadas",
      });
    } else {
      try {
        const ids = req.session.tempGrupos;
        const creditos_restantes = req.session.creditos;

        const id = req.user.id;
        console.log(req.session.tempGrupos);
        console.log(req.user.id);
        const creditos = await bd.Estudiante.findOne({
          where: { id_usuario: id },
        });

        let c = creditos.creditos_disponibles - creditos_restantes;
        console.log("Creditos consumidos", c);
        if (c < 33.33 || c > 50) {
          return res.json({
            success: false,
            message: "No cumple con la carga mínima o máxima",
          });
        }

        // --- VALIDACIÓN FINAL DE OPTATIVAS ---
        const alumno = await bd.DatosPersonales.findOne({ where: { id } });
        const carrera = alumno.carrera;
        const kardex = await bd.Kardex.findOne({ where: { id_alumno: id } });

        let optativasAprobadas6to = 0;
        let optativasAprobadas7mo = 0;

        if (kardex) {
          const aprobadas = await bd.UA_Aprobada.findAll({
            where: { id_kardex: kardex.id },
          });

          for (const ap of aprobadas) {
            const ua = await bd.Unidad_Aprendizaje.findOne({
              where: { nombre: ap.unidad_aprendizaje, carrera: carrera },
            });

            if (ua && ua.tipo === "OPTATIVA") {
              if (ua.semestre === 6) optativasAprobadas6to++;
              if (ua.semestre === 7) optativasAprobadas7mo++;
            }
          }
        }

        let optativasSesion6to = 0;
        let optativasSesion7mo = 0;

        for (const idGrupo of ids) {
          const grupoTemp = await bd.Grupo.findOne({
            where: { id: idGrupo },
            include: [
              {
                model: bd.Unidad_Aprendizaje,
                attributes: ["tipo", "semestre"],
              },
            ],
            raw: true,
            nest: true,
          });

          if (grupoTemp && grupoTemp.Unidad_Aprendizaje.tipo === "OPTATIVA") {
            if (grupoTemp.Unidad_Aprendizaje.semestre === 6)
              optativasSesion6to++;
            if (grupoTemp.Unidad_Aprendizaje.semestre === 7)
              optativasSesion7mo++;
          }
        }

        const totalOptativas6to = optativasAprobadas6to + optativasSesion6to;
        const totalOptativas7mo = optativasAprobadas7mo + optativasSesion7mo;

        if (totalOptativas6to > 2) {
          return res.json({
            success: false,
            message: `Excedes el límite de 2 optativas de 6to semestre (${optativasAprobadas6to} cursadas, ${optativasSesion6to} seleccionadas)`,
          });
        }

        if (totalOptativas7mo > 2) {
          return res.json({
            success: false,
            message: `Excedes el límite de 2 optativas de 7mo semestre (${optativasAprobadas7mo} cursadas, ${optativasSesion7mo} seleccionadas)`,
          });
        }

        console.log("creditos restantes", creditos_restantes);
        console.log("ID: ", id);

        const idh = await bd.Horario.findOne({
          where: { id_alumno: id },
        });
        const cre = await bd.Estudiante.update(
          {
            creditos_disponibles: creditos_restantes,
          },
          { where: { id_usuario: id } }
        );

        for (const g of ids) {
          const ua = await bd.Unidad_Aprendizaje.findOne({
            include: [
              {
                model: bd.Grupo,
                where: { id: g },
              },
            ],
          });

          const recu = await bd.Materia_Reprobada.findOne({
            include: [
              {
                model: bd.Estudiante,
                where: { id_usuario: id },
              },
              {
                model: bd.Unidad_Aprendizaje,
                where: { id: ua.id },
              },
            ],
          });

          // Si NO existe, no hacer el update
          if (!recu) {
          } else {
            // Si existe, actualizar
            await bd.Materia_Reprobada.update(
              {
                recurse: 0,
                estado_actual: "Recurse",
              },
              { where: { id: recu.id } }
            );
          }

          const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
          const crear_mat_inscrita = await bd.Mat_Inscritos.create({
            id: id2,
            id_horario: idh.id,
            id_grupo: g,
          });
          const cup_act = await bd.Grupo.findOne({
            where: { id: g },
          });

          const up_grup = await bd.Grupo.update(
            {
              cupo: parseInt(cup_act.cupo, 10) - 1,
            },
            { where: { id: g } }
          );
        }

        await bd.Inscripcion.destroy({
          where: { id_alumno: id },
        });
        console.log("SE INSCRIBIO");
        return res.json({ success: true });
      } catch (err) {
        console.log(err);
        return res.json({ success: false });
      }
    }
  });

  router.post("/Del/:id", async (req, res) => {
    const { id } = req.params;
    const us = req.user.id;

    const cre = await bd.Estudiante.findOne({
      where: { id_usuario: us },
    });

    const cuesta = await bd.Grupo.findOne({
      where: { id: id },
      include: [
        {
          model: bd.Unidad_Aprendizaje,
          attributes: ["credito"],
        },
      ],
      raw: true,
      nest: true,
    });

    req.session.tempGrupos = req.session.tempGrupos.filter((g) => g != id);
    req.session.creditos =
      parseInt(req.session.creditos, 10) +
      parseInt(cuesta.Unidad_Aprendizaje.credito, 10);

    console.log("Grupo sin el elemento ", req.session.tempGrupos);
    console.log("Creditos:", req.session.creditos);
    res.json({
      success: true,
      tempGrupo: req.session.tempGrupos,
      credits: req.session.creditos,
    });
  });

  router.get("/ConsultarBorrador", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado",
      });
    }

    try {
      const borr = await bd.Borrador_Horario.findAll({
        where: { id_alumno: req.user.id },
        include: [
          {
            model: bd.DatosPersonales,
            attributes: ["nombre", "ape_paterno", "ape_materno"],
            as: "profesor",
          },
          {
            model: bd.Grupo,
            attributes: ["nombre", "cupo"],
            include: [
              {
                model: bd.Unidad_Aprendizaje,
                attributes: ["credito"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });
      return res.json({ horario: borr });
    } catch (err) {
      console.error("Error en /ConsultarBorrador:", err);
      return res.status(500).json({
        success: false,
        error: "Error al consultar el borrador",
      });
    }
  });

  router.post("/EliminarBorrador/:id", async (req, res) => {
    const us = req.user.id;
    const { id } = req.params;

    const grupo = await bd.Grupo.findOne({ where: { id } });

    // Distribución del grupo que se va a eliminar
    const distriNuevo = await bd.Distribucion.findAll({
      where: { id_grupo: id },
    });

    // Obtener todos los grupos del borrador del usuario actual
    const b = await bd.Borrador_Horario.findOne({
      where: { id_alumno: us, id_grupo: id },
    });

    if (b.valido != 1) {
      const eli = await bd.Borrador_Horario.destroy({
        where: { id_grupo: id },
      });
      const borradores = await bd.Borrador_Horario.findAll({
        where: { id_alumno: us },
      });
      const idsGruposUsuario = borradores.map((t) => t.id_grupo);
      const distribucionesExistentes = await bd.Distribucion.findAll({
        where: { id_grupo: idsGruposUsuario },
      });

      let hayTraslape = false;
      // Verificar traslapes
      for (const dis of distriNuevo) {
        for (const dis2 of distribucionesExistentes) {
          if (seTraslapan(dis, dis2)) {
            hayTraslape = true;
            await bd.Borrador_Horario.update(
              { valido: 1 },
              { where: { id_grupo: dis2.id_grupo, id_alumno: us } }
            );
          }
        }
      }
      if (hayTraslape) {
        for (const d of distribucionesExistentes) {
          for (const d2 of distribucionesExistentes) {
            if (d.id_grupo != d2.id_grupo) {
              if (seTraslapan(d, d2)) {
                await bd.Borrador_Horario.update(
                  { valido: 0 },
                  { where: { id_grupo: d.id_grupo, id_alumno: us } }
                );
                await bd.Borrador_Horario.update(
                  { valido: 0 },
                  { where: { id_grupo: d2.id_grupo, id_alumno: us } }
                );
              }
            }
          }
        }
      }

      return res.json({ success: true });
    } else {
      const eli = await bd.Borrador_Horario.destroy({
        where: { id_grupo: id },
      });
      return res.json({ success: true });
    }
  });
  router.post("/AgregarBorrador/:id", async (req, res) => {
    try {
      const us = req.user.id;
      const { id } = req.params;
      const id2 = uuidv4().replace(/-/g, "").substring(0, 15);
      let val = 1;

      //Obtener grupo, profesor y materia
      const grupo = await bd.Grupo.findOne({ where: { id } });
      const ua = await bd.Unidad_Aprendizaje.findOne({
        where: { id: grupo.id_ua },
      });
      const dat = await bd.DatosPersonales.findOne({
        where: { id: grupo.id_prof },
      });

      // Distribución del grupo que se va a agregar
      const distriNuevo = await bd.Distribucion.findAll({
        where: { id_grupo: id },
      });

      // Obtener todos los grupos del borrador del usuario actual
      const borradores = await bd.Borrador_Horario.findAll({
        where: { id_alumno: us },
      });

      if (borradores && borradores.length > 0) {
        //Obtener los id_grupo actuales del borrador
        const idsGruposUsuario = borradores.map((t) => t.id_grupo);

        // Obtener sus distribuciones
        const distribucionesExistentes = await bd.Distribucion.findAll({
          where: { id_grupo: idsGruposUsuario },
        });

        // Verificar traslapes
        for (const dis of distriNuevo) {
          for (const dis2 of distribucionesExistentes) {
            console.log(dis);
            console.log(dis2);
            if (seTraslapan(dis, dis2)) {
              val = 0;
              // Marcar el grupo existente como no válido
              await bd.Borrador_Horario.update(
                { valido: 0 },
                { where: { id_grupo: dis2.id_grupo, id_alumno: us } }
              );
            }
          }
        }
      }

      // Armar las horas por día
      let lun, mar, mier, jue, vie;
      for (const g of distriNuevo) {
        const horas = `${g.hora_ini} - ${g.hora_fin}`;
        if (g.dia === "Lunes") lun = horas;
        else if (g.dia === "Martes") mar = horas;
        else if (g.dia === "Miércoles") mier = horas;
        else if (g.dia === "Jueves") jue = horas;
        else if (g.dia === "Viernes") vie = horas;
      }

      // Crear el nuevo registro en borrador
      const borr = await bd.Borrador_Horario.create({
        id: id2,
        id_grupo: id,
        id_alumno: us,
        id_profesor: grupo.id_prof,
        calificacion: dat.calificacion,
        materia: ua.nombre,
        horas_lun: lun,
        horas_mar: mar,
        horas_mie: mier,
        horas_jue: jue,
        horas_vie: vie,
        creditos_necesarios: ua.credito,
        valido: val,
      });

      return res.json({
        success: true,
        message: val
          ? "Grupo agregado correctamente sin traslapes."
          : "Grupo agregado, pero se detectaron traslapes. Marcado como no válido.",
        grupo: borr,
      });
    } catch (error) {
      console.error("Error al agregar borrador:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  });

  router.get("/ObtenerHistorial", async (req, res) => {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado. Por favor inicia sesión.",
      });
    }

    const us = req.user.id;
    try {
      const k = await bd.Kardex.findOne({ where: { id_alumno: us } });

      if (!k) {
        return res.json({ historial: [], semestres: [] });
      }

      const sems = await bd.UA_Aprobada.findAll({
        where: { id_kardex: k.id },
        raw: true,
        nest: true,
      });
      const car = await bd.DatosPersonales.findOne({
        where: { id: us },
      });

      const semestres = [...new Set(sems.map((s) => s.semestre))];

      return res.json({
        historial: sems,
        semestres: semestres,
        carrera: car.carrera,
      });
    } catch (err) {
      console.error("Error en /ObtenerHistorial:", err);
      return res.status(500).json({
        success: false,
        error: "Error al obtener el historial académico",
      });
    }
  });
  router.get("/ObtenerHistorial/:id", async (req, res) => {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado. Por favor inicia sesión.",
      });
    }

    try {
      const { id } = req.params;
      const materiasre = await bd.Materia_Reprobada.findAll({
        where: { recurse: 0 },
        include: [
          {
            model: bd.Estudiante,
            where: { id_usuario: id },
            required: true,
          },
        ],
        raw: true,
        nest: true,
      });
      const k = await bd.Kardex.findOne({ where: { id_alumno: id } });

      if (!k) {
        return res.json({ historial: [], semestres: [] });
      }

      const sems = await bd.UA_Aprobada.findAll({
        where: { id_kardex: k.id },
        raw: true,
        nest: true,
      });
      const car = await bd.DatosPersonales.findOne({
        where: { id: id },
      });

      const semestres = [...new Set(sems.map((s) => s.semestre))];

      return res.json({
        historial: sems,
        semestres: semestres,
        carrera: car.carrera,
        materiasreprobadas: materiasre,
      });
    } catch (err) {
      console.error("Error en /ObtenerHistorial:", err);
      return res.status(500).json({
        success: false,
        error: "Error al obtener el historial académico",
      });
    }
  });

  // Obtener mensajes previos del chatbot para un usuario
  router.get("/MensajesChat/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (req.user.id !== id && req.user.tipo_usuario !== "administrador") {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para acceder a estos mensajes",
        });
      }

      // Validar formato de ID
      if (!id || id.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
        });
      }

      // Buscar mensajes asociados al usuario, ordenados por fecha asc
      const mensajes = await bd.Mensaje_Chat.findAll({
        where: { id_usuario: id },
        order: [["fecha", "ASC"]],
        raw: true,
      });

      return res.json({ success: true, messages: mensajes });
    } catch (err) {
      console.error("Error al obtener MensajesChat/:id ->", err);
      return res
        .status(500)
        .json({ success: false, error: "Error al obtener mensajes" });
    }
  });

  router.get("/ObtenerMateriasReprobadas", async (req, res) => {
    const id = req.user.id;

    try {
      const mat_re = await bd.Materia_Reprobada.findAll({
        include: [
          {
            model: bd.Estudiante,
            where: { id_usuario: id },
          },
          {
            model: bd.Unidad_Aprendizaje,
            attributes: ["nombre", "credito", "semestre"],
          },
        ],
      });

      const ids_mr = mat_re.map((m) => m.id);

      const compro = await bd.ETS.findAll({
        where: {
          id_mr: ids_mr,
        },
      });

      return res.json({
        materias: mat_re,
        compro: compro,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  router.get("/ObtenerGruposEts/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const grupos = await bd.ETS_grupo.findAll({
        include: [
          {
            model: bd.Unidad_Aprendizaje,
            where: { nombre: id },
          },
          {
            model: bd.DatosPersonales,
          },
        ],
      });

      return res.json({ horarios: grupos });
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/RegistrarETS", async (req, res) => {
    const { id_mr, id_grupo } = req.body;
    const us = req.user.id;

    try {
      // Obtener grupo nuevo
      const grupoNuevo = await bd.ETS_grupo.findOne({
        where: { id: id_grupo },
      });

      if (!grupoNuevo) {
        return res.json({ success: false, message: "Grupo no encontrado" });
      }

      // ETS existentes del alumno
      const etsExistentes = await bd.ETS.findAll({
        include: [
          {
            model: bd.Materia_Reprobada,
            include: [
              {
                model: bd.Estudiante,
                where: { id_usuario: us },
              },
            ],
          },
          {
            model: bd.ETS_grupo,
          },
        ],
      });

      const nuevoHorario = {
        dia: grupoNuevo.fecha,
        hora_ini: grupoNuevo.hora_inicio,
        hora_fin: grupoNuevo.hora_final,
      };

      for (const ets of etsExistentes) {
        const horarioExistente = {
          dia: ets.ETS_Grupo.fecha,
          hora_ini: ets.ETS_Grupo.hora_inicio,
          hora_fin: ets.ETS_Grupo.hora_final,
        };

        if (seTraslapan(nuevoHorario, horarioExistente)) {
          return res.json({
            success: false,
            message:
              "el horario del grupo seleccionado se traslapa con un ETS ya registrado.",
          });
        }
      }

      await bd.ETS.create({
        id: uuidv4().replace(/-/g, "").substring(0, 15),
        id_mr: id_mr,
        id_grupo: id_grupo,
        comprobante: null,
        validado: 0,
        calificado: 0,
      });

      await bd.Materia_Reprobada.update(
        { estado_actual: "ETS" },
        { where: { id: id_mr } }
      );

      const ge = await bd.ETS_grupo.findOne({
        where: { id: id_grupo },
      });
      await bd.ETS_grupo.update(
        {
          cupo: parseInt(ge.cupo) - 1,
        },
        { where: { id: id_grupo } }
      );

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, message: "Error en el servidor" });
    }
  });

  router.post("/SubirComprobante", async (req, res) => {
    const { documento, id_mr, id_grupo } = req.body;

    try {
      const comprobante = await bd.ETS.update(
        {
          comprobante: documento ? Buffer.from(documento, "base64") : null,
        },
        { where: { id_mr: id_mr, comprobante: null, id_grupo: id_grupo } }
      );
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/NoReinscripcion", async (req, res) => {
    const us = req.user.id;

    try {
      const noReins = await bd.Materia_Reprobada.findAll({
        include: [
          {
            model: bd.Estudiante,
            where: { id_usuario: us },
          },
        ],
        where: { recurse: 0 },
      });

      let ids = noReins.map((item) => item.id_ua);

      ids = [...new Set(ids)];
      return res.json({ grupos: ids });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
  });

  router.get("/ObtenerHistorialETS/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const histo = await bd.ETS.findAll({
        where: { id_mr: id, calificado: { [Op.ne]: 0 } },
        include: [
          {
            model: bd.ETS_grupo,
            include: [
              {
                model: bd.Unidad_Aprendizaje,
              },
              {
                model: bd.DatosPersonales,
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      return res.json({ historial: histo });
    } catch (err) {
      console.log(err);
    }
  });

  // Guardar mensaje de chat en la base de datos
  router.post("/GuardarMensajeChat", async (req, res) => {
    try {
      const { id_usuario, pregunta_realizada, respuesta_obtenida } = req.body;

      // Validar que el usuario esté autenticado y sea el mismo que intenta guardar
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
        });
      }

      if (req.user.id !== id_usuario) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para guardar mensajes de otro usuario",
        });
      }

      // Validar que al menos la pregunta esté presente
      if (!pregunta_realizada || pregunta_realizada.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "La pregunta no puede estar vacía",
        });
      }

      // Validar longitud de pregunta
      if (pregunta_realizada.length > 5000) {
        return res.status(400).json({
          success: false,
          error: "La pregunta es demasiado larga (máximo 5000 caracteres)",
        });
      }

      // Generar ID único para el mensaje
      const id = uuidv4().replace(/-/g, "").substring(0, 15);
      const fecha = new Date();

      // Crear el mensaje en BD
      const mensaje = await bd.Mensaje_Chat.create({
        id: id,
        id_usuario: id_usuario,
        fecha: fecha,
        pregunta_realizada: pregunta_realizada,
        respuesta_obtenida: respuesta_obtenida || null,
      });

      return res.json({
        success: true,
        mensaje: mensaje,
        message: "Mensaje guardado correctamente",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Error al guardar el mensaje",
      });
    }
  });

  // Validar fechas de evaluación de profesores
  router.get("/ValidarFechaEvaluacionProfe", async (req, res) => {
    try {
      console.log("Endpoint ValidarFechaEvaluacionProfe llamado");
      const fechaActual = new Date();
      const fechas = await bd.FechasRelevantes.findOne({
        order: [["inicio_semestre", "DESC"]],
      });

      console.log(
        "Fechas encontradas:",
        fechas
          ? {
              evalu_profe: fechas.evalu_profe,
              fin_evalu_profe: fechas.fin_evalu_profe,
            }
          : "No hay fechas"
      );

      if (!fechas) {
        return res.status(404).json({
          success: false,
          error: "No se encontraron fechas relevantes",
        });
      }

      const inicioEvalProfe = new Date(fechas.evalu_profe);
      const finEvalProfe = new Date(fechas.fin_evalu_profe);

      console.log("Fecha actual:", fechaActual);
      console.log("Inicio eval:", inicioEvalProfe);
      console.log("Fin eval:", finEvalProfe);

      const dentroDelPeriodo =
        fechaActual >= inicioEvalProfe && fechaActual <= finEvalProfe;

      console.log("Dentro del periodo:", dentroDelPeriodo);

      return res.json({
        success: true,
        valida: dentroDelPeriodo,
        fechaInicio: fechas.evalu_profe,
        fechaFin: fechas.fin_evalu_profe,
        mensaje: dentroDelPeriodo
          ? "Periodo de evaluación activo"
          : "Fuera del periodo de evaluación de profesores",
      });
    } catch (err) {
      console.error("Error en /ValidarFechaEvaluacionProfe:", err);
      return res.status(500).json({
        success: false,
        error: "Error al validar fechas",
      });
    }
  });

  // Actualizar o crear registro en la tabla 'contador' para un profesor
  router.post("/ActualizarContadorProfesor", async (req, res) => {
    try {
      const fechaActual = new Date();
      const fechas = await bd.FechasRelevantes.findOne({
        order: [["inicio_semestre", "DESC"]],
      });

      if (!fechas)
        return res.status(404).json({
          success: false,
          error: "No se encontraron fechas relevantes",
        });

      const inicioEvalProfe = new Date(fechas.evalu_profe);
      const finEvalProfe = new Date(fechas.fin_evalu_profe);

      if (fechaActual < inicioEvalProfe || fechaActual > finEvalProfe) {
        return res.status(403).json({
          success: false,
          error: "Fuera del periodo de evaluación de profesores",
          fechaInicio: fechas.evalu_profe,
          fechaFin: fechas.fin_evalu_profe,
        });
      }

      if (!req.user || !req.user.id)
        return res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
        });

      const { profesor, id_profesor, alumnoId, suma } = req.body;

      if (!id_profesor && !profesor)
        return res.status(400).json({
          success: false,
          error: "Faltan datos (id_profesor o profesor)",
        });

      if (suma === undefined || suma === null)
        return res.status(400).json({
          success: false,
          error: "Falta la suma",
        });

      let idProf = id_profesor;

      if (!idProf && profesor) {
        const nombreCompleto = profesor.trim();

        // Buscar por nombre exacto
        let prof = await bd.DatosPersonales.findOne({
          where: bd.sequelize.where(
            bd.sequelize.fn(
              "concat",
              bd.sequelize.col("nombre"),
              " ",
              bd.sequelize.col("ape_paterno"),
              " ",
              bd.sequelize.col("ape_materno")
            ),
            nombreCompleto
          ),
        });

        // Buscar por LIKE si no se encontró
        if (!prof) {
          prof = await bd.DatosPersonales.findOne({
            where: bd.sequelize.where(
              bd.sequelize.fn(
                "concat",
                bd.sequelize.col("nombre"),
                " ",
                bd.sequelize.col("ape_paterno"),
                " ",
                bd.sequelize.col("ape_materno")
              ),
              { [Op.like]: `%${nombreCompleto}%` }
            ),
          });
        }

        if (!prof) {
          return res.status(404).json({
            success: false,
            error: "Profesor no encontrado",
          });
        }

        idProf = prof.id; // ESTE ES EL ID REAL
      }

      // Buscar registro en CONTADOR
      let contador = await bd.Contador.findOne({
        where: { id_profesor: idProf },
      });

      if (contador) {
        // Sumar valores
        const nuevaSuma = (contador.suma || 0) + parseInt(suma, 10);
        const nuevosRegistrados = (contador.registrados || 0) + 1;

        // UPDATE correcto
        await bd.Contador.update(
          { suma: nuevaSuma, registrados: nuevosRegistrados },
          { where: { id_profesor: idProf } }
        );

        contador = await bd.Contador.findOne({
          where: { id_profesor: idProf },
        });
      } else {
        // Crear nuevo registro
        contador = await bd.Contador.create({
          id_profesor: idProf,
          suma: parseInt(suma, 10),
          registrados: 1,
        });
      }

      // Calcular calificación
      const cal = parseFloat(contador.suma) / parseFloat(contador.registrados);

      // UPDATE correcto en DatosPersonales
      await bd.DatosPersonales.update(
        { calificacion: cal },
        { where: { id: idProf } } // 🔥 ESTE ES EL CORRECTO
      );

      return res.json({
        success: true,
        registrado: contador.registrados,
      });
    } catch (err) {
      console.error("Error en /ActualizarContadorProfesor:", err);
      return res.status(500).json({
        success: false,
        error: "Error interno al actualizar contador",
      });
    }
  });

  // Actualizar respuesta de un mensaje de chat existente
  router.put("/ActualizarMensajeChat/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { respuesta_obtenida } = req.body;

      // Validar que el usuario esté autenticado
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
        });
      }

      // Validar que la respuesta no sea vacía si se proporciona
      if (
        respuesta_obtenida !== null &&
        respuesta_obtenida !== undefined &&
        respuesta_obtenida.trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          error: "La respuesta no puede estar vacía",
        });
      }

      // Buscar el mensaje
      const mensaje = await bd.Mensaje_Chat.findByPk(id);

      if (!mensaje) {
        return res.status(404).json({
          success: false,
          error: "Mensaje no encontrado",
        });
      }

      // Validar que el usuario sea el propietario del mensaje o admin
      if (
        mensaje.id_usuario !== req.user.id &&
        req.user.tipo_usuario !== "administrador"
      ) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para actualizar este mensaje",
        });
      }

      // Actualizar la respuesta
      await mensaje.update({
        respuesta_obtenida: respuesta_obtenida || null,
      });

      return res.json({
        success: true,
        mensaje: mensaje,
        message: "Respuesta guardada correctamente",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Error al actualizar el mensaje",
      });
    }
  });

  // Validar si es tiempo de evaluar profesores
  router.get("/ValidarFechaEvaluacion", async (req, res) => {
    try {
      const fechas = await bd.FechasRelevantes.findOne();

      if (!fechas || !fechas.evalu_profe) {
        return res.json({
          valido: false,
          mensaje: "No hay fechas de evaluación configuradas",
        });
      }

      const fechaEvaluacion = new Date(fechas.evalu_profe);
      const hoy = new Date();

      // normalizar fechas para comparar solo dia/mes/año
      const fechaEvalNorm = new Date(
        fechaEvaluacion.getFullYear(),
        fechaEvaluacion.getMonth(),
        fechaEvaluacion.getDate()
      );
      const hoyNorm = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
      );

      if (hoyNorm.getTime() === fechaEvalNorm.getTime()) {
        return res.json({
          valido: true,
          mensaje: "Es momento de evaluar a tus profesores",
        });
      } else {
        return res.json({
          valido: false,
          mensaje: "Aún no es tiempo de evaluar a tus profesores",
          fechaEvaluacion: fechaEvaluacion.toLocaleDateString("es-MX"),
        });
      }
    } catch (err) {
      console.error("Error en /ValidarFechaEvaluacion:", err);
      return res.status(500).json({
        success: false,
        error: "Error al validar fecha de evaluación",
      });
    }
  });

  // Devuelve los IDs de los profesores evaluados por el alumno
  router.get("/api/profesor/evaluados/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const periodo = await bd.FechasRelevantes.findOne({ where: {} });
      // Buscar todas las reseñas hechas por el alumno
      const resenas = await bd.Resena.findAll({
        where: { id_alumno: id, periodo: { [Op.like]: periodo.periodo } },
        attributes: ["id_profesor"],
      });
      // Extraer IDs únicos de los profesores evaluados
      const evaluados = [
        ...new Set(resenas.map((r) => r.id_profesor).filter(Boolean)),
      ];
      return res.json({ evaluados });
    } catch (err) {
      console.error("Error en /api/profesor/evaluados/:id", err);
      return res.status(500).json({ error: "Error interno" });
    }
  });

  router.get("/TiempoReinscripcion", requireAuth, async (req, res) => {
    const us = req.user.id;

    const tiempo = await bd.Inscripcion.findOne({ where: { id_alumno: us } });
    const alumno = await bd.DatosPersonales.findOne({ where: { id: us } });
    const pro = await bd.Estudiante.findOne({ where: { id_usuario: us } });

    if (!tiempo) {
      return res.status(404).json({
        error: "No tiene cita generada.",
        promedio: pro.promedio,
        edo: pro.estado_academico,
        nombre:
          alumno.ape_paterno + " " + alumno.ape_materno + " " + alumno.nombre,
        carrera: alumno.carrera,
      });
    }

    // === FECHAS PARA COMPARACIÓN (estas sí en UTC-6) ===
    const hoy = toCDMX(new Date());
    const fechaInicio = toCDMX(new Date(tiempo.fecha_hora_in));
    const fechaFin = toCDMX(new Date(tiempo.fecha_hora_cad));

    const estaEnRango = hoy >= fechaInicio && hoy <= fechaFin;

    // === STRINGS PARA MOSTRAR (SIN convertir a UTC-6) ===
    const inicioStr = new Date(tiempo.fecha_hora_in).toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const finStr = new Date(tiempo.fecha_hora_cad).toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const yareinscrito = await bd.Mat_Inscritos.count({
      include: [
        {
          model: bd.Horario,
          where: {
            id_alumno: us,
          },
          required: true,
        },
      ],
    });
    console.log(yareinscrito);

    if (yareinscrito > 0) {
      return res.json({
        tiempo: false,
        cita: false,
        promedio: pro.promedio,
        edo: pro.estado_academico,
        nombre:
          alumno.ape_paterno + " " + alumno.ape_materno + " " + alumno.nombre,
        carrera: alumno.carrera,
      });
    }

    return res.json({
      tiempo: estaEnRango,
      cita: true,
      citas: `${inicioStr} - ${finStr}`,
      promedio: pro.promedio,
      edo: pro.estado_academico,
      nombre:
        alumno.ape_paterno + " " + alumno.ape_materno + " " + alumno.nombre,
      carrera: alumno.carrera,
    });
  });

  router.get("/TiempoInscripcionETS", async (req, res) => {
    const tiempo = await bd.FechasRelevantes.findOne();
    const hoy = toCDMX(new Date());
    const fechaInicio = new Date(tiempo.inscribir_ets);
    const fechaFin = new Date(tiempo.fin_inscribir_ets);

    const estaEnRango = hoy >= fechaInicio && hoy <= fechaFin;

    return res.json({ success: estaEnRango });
  });
  router.get("/TiempoSubirComprobante", async (req, res) => {
    const tiempo = await bd.FechasRelevantes.findOne();
    const hoy = toCDMX(new Date());
    const fechaInicio = new Date(tiempo.subir_doc_ets);
    const fechaFin = new Date(tiempo.fin_subir_doc_ets);

    const estaEnRango = hoy >= fechaInicio && hoy <= fechaFin;

    return res.json({ success: estaEnRango });
  });

  router.get("/ConsultarResenas/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
      const resena = await bd.Resena.findAll({
        where: { id_profesor: id },
      });

      return res.json({ resenas: resena });
    } catch (err) {
      console.log(err);
    }
  });

  // Ruta para que el alumno obtenga sus propios datos
  router.get(
    "/ObtenerAlumno/:id",
    requireAuth,
    requireRole(["alumno"]),
    async (req, res) => {
      const { id } = req.params;
      try {
        const alumno = await bd.DatosPersonales.findOne({
          where: { id: id, tipo_usuario: "alumno" },
          raw: true,
          nest: true,
        });
        return res.json({ alumno: alumno });
      } catch (error) {
        console.error("Error al obtener alumno: ", error);
        return res.status(500).json({ error: "Error al obtener alumno" });
      }
    }
  );

  // Ruta compartida: tanto alumnos como profesores pueden verificar si es primera vez
  router.get(
    "/PrimeraVez/:id",
    requireAuth,
    requireRole(["alumno", "profesor"]),
    async (req, res) => {
      const { id } = req.params;
      try {
        const a = await bd.DatosPersonales.findOne({
          where: { id: id },
        });
        if (a.primera_vez == null || a.primera_vez == 0) {
          return res.json({ primera_vez: false });
        } else if (a.primera_vez == 1) {
          return res.json({ primera_vez: true });
        }
      } catch (err) {
        console.log(err);
      }
    }
  );
  return router;
};

function isNowInRange(now, start, end) {
  return now >= start && now <= end;
}

function nowCDMX() {
  const nowUTC = new Date();
  // restamos 6 horas para convertir UTC → UTC-6 (CDMX)
  nowUTC.setHours(nowUTC.getHours() - 6);
  return nowUTC;
}

function toCDMX(date) {
  // offset de CDMX en horas
  const offset = -6; // UTC-6
  return new Date(date.getTime() + offset * 60 * 60 * 1000);
}

function seTraslapan(d1, d2) {
  // Solo comparar si es el mismo día
  if (d1.dia !== d2.dia) return false;

  const ini1 = parseInt(d1.hora_ini.replace(":", ""));
  const fin1 = parseInt(d1.hora_fin.replace(":", ""));
  const ini2 = parseInt(d2.hora_ini.replace(":", ""));
  const fin2 = parseInt(d2.hora_fin.replace(":", ""));

  // Se traslapan si uno empieza antes de que el otro termine y termina después de que el otro empieza
  return ini1 < fin2 && ini2 < fin1;
}
