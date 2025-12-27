const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const e = require("express");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
  host: isProduction ? undefined : process.env.DB_HOST,
  port: isProduction ? undefined : parseInt(process.env.DB_PORT || "3306"),
  logging: false,
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  timezone: '-06:00', // Adjust timezone if necessary
  charset: 'utf8mb4',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const DatosPersonales = sequelize.define(
  "DatosPersonales",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    contrasena: { type: DataTypes.TEXT, allowNull: false },
    tipo_usuario: { type: DataTypes.TEXT, allowNull: false },
    nombre: { type: DataTypes.TEXT, allowNull: false },
    ape_paterno: { type: DataTypes.TEXT, allowNull: false },
    ape_materno: { type: DataTypes.TEXT, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATE, allowNull: false },
    RFC: { type: DataTypes.TEXT },
    tipo_sangre: { type: DataTypes.TEXT, allowNull: false },
    CURP: { type: DataTypes.TEXT, allowNull: false },
    nacionalidad: { type: DataTypes.TEXT, allowNull: false },
    calle: { type: DataTypes.TEXT, allowNull: false },
    num_exterior: { type: DataTypes.TEXT, allowNull: false },
    num_interior: { type: DataTypes.TEXT, allowNull: false },
    codigo_postal: { type: DataTypes.TEXT, allowNull: false },
    colonia: { type: DataTypes.TEXT, allowNull: false },
    delegacion: { type: DataTypes.TEXT, allowNull: false },
    ciudad: { type: DataTypes.TEXT, allowNull: false },
    telefono: { type: DataTypes.TEXT, allowNull: false },
    email: { type: DataTypes.TEXT, allowNull: false },
    foto: { type: DataTypes.BLOB },
    grado: { type: DataTypes.TEXT },
    carrera: { type: DataTypes.TEXT },
    situacion: { type: DataTypes.TEXT },
    calificacion: { type: DataTypes.FLOAT },
    primera_vez: { type: DataTypes.INTEGER },
  },
  { tableName: "datos_personales", timestamps: false }
);

const DatosMedicos = sequelize.define(
  "DatosMedicos",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_usuario: { type: DataTypes.STRING(15), allowNull: false },
    peso: { type: DataTypes.FLOAT, allowNull: false },
    altura: { type: DataTypes.FLOAT, allowNull: false },
    tipo_sangre: { type: DataTypes.TEXT, allowNull: false },
    nss: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "datos_medicos", timestamps: false }
);

DatosMedicos.associate = (models) => {
  DatosMedicos.belongsTo(models.DatosPersonales, {
    foreignKey: "id_usuario",
    targetKey: "id",
  });
};

const Enfermedades = sequelize.define(
  "Enfermedades",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_dat_med: { type: DataTypes.STRING(15), allowNull: false },
    descri: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "enfermedades", timestamps: false }
);

Enfermedades.belongsTo(DatosMedicos, {
  foreignKey: "id_dat_med",
  targetKey: "id",
});

const Estudiante = sequelize.define(
  "Estudiante",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_usuario: { type: DataTypes.STRING(15), allowNull: false },
    promedio: { type: DataTypes.FLOAT, allowNull: false },
    creditos_disponibles: { type: DataTypes.FLOAT, allowNull: false },
    estado_academico: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "estudiante", timestamps: false }
);

Estudiante.belongsTo(DatosPersonales, {
  foreignKey: "id_usuario",
  targetKey: "id",
});
DatosPersonales.hasOne(Estudiante, {
  foreignKey: "id_usuario",
  targetKey: "id",
});

const Carrera = sequelize.define(
  "Carrera",
  {
    nombre: { type: DataTypes.STRING(40), primaryKey: true },
    creditos_iniciales: { type: DataTypes.INTEGER, allowNull: false },
    prefijo_grupo: { type: DataTypes.TEXT, allowNull: false },
    duracion_max: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "carrera", timestamps: false }
);

const Unidad_Aprendizaje = sequelize.define(
  "Unidad_Aprendizaje",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    nombre: { type: DataTypes.TEXT, allowNull: false },
    credito: { type: DataTypes.FLOAT, allowNull: false },
    carrera: { type: DataTypes.STRING(50), allowNull: false },
    semestre: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "unidad_de_aprendizaje", timestamps: false }
);
Unidad_Aprendizaje.associate = (models) => {
  Unidad_Aprendizaje.belongsTo(models.Carrera, {
    foreignKey: "carrera",
    targetKey: "nombre",
  });
};

const Grupo = sequelize.define(
  "Grupo",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    nombre: { type: DataTypes.TEXT, allowNull: false },
    id_ua: { type: DataTypes.STRING(15), allowNull: false, references: {} },
    id_prof: { type: DataTypes.STRING(15), allowNull: false },
    turno: { type: DataTypes.TEXT, allowNull: false },
    cupo: { type: DataTypes.INTEGER, allowNull: false },
    salon: { type: DataTypes.TEXT, allowNull: true },
    reg_final: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    reg_extra: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  { tableName: "grupo", timestamps: false }
);

Grupo.belongsTo(Unidad_Aprendizaje, {
  foreignKey: "id_ua",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
Grupo.belongsTo(DatosPersonales, {
  foreignKey: "id_prof",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

Unidad_Aprendizaje.hasMany(Grupo, {
  foreignKey: "id_ua",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
DatosPersonales.hasOne(Grupo, {
  foreignKey: "id_prof",
  targetKey: "id",
});

const Distribucion = sequelize.define(
  "Distribucion",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_grupo: { type: DataTypes.STRING(15), allowNull: false },
    hora_ini: { type: DataTypes.TEXT, allowNull: false },
    hora_fin: { type: DataTypes.TEXT, allowNull: false },
    dia: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "distribucion", timestamps: false }
);

Distribucion.belongsTo(Grupo, {
  foreignKey: "id_grupo",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

Grupo.hasMany(Distribucion, {
  foreignKey: "id_grupo",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

const Horario = sequelize.define(
  "Horario",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_alumno: { type: DataTypes.STRING(15), allowNull: false },
  },
  { tableName: "horario", timestamps: false }
);

Horario.belongsTo(DatosPersonales, {
  foreignKey: "id_alumno",
  targetKey: "id",
});
DatosPersonales.hasOne(Horario, {
  foreignKey: "id_alumno",
  sourceKey: "id",
});

const Mat_Inscritos = sequelize.define(
  "Mat_Inscritos",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_horario: { type: DataTypes.STRING(15), allowNull: false },
    id_grupo: { type: DataTypes.STRING(15), allowNull: false },
    calificacion_primer: { type: DataTypes.FLOAT, allowNull: true },
    calificacion_segundo: { type: DataTypes.FLOAT, allowNull: true },
    calificacion_tercer: { type: DataTypes.FLOAT, allowNull: true },
    calificacion_final: { type: DataTypes.FLOAT, allowNull: true },
    extra: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "mat_inscritos", timestamps: false }
);

Horario.hasMany(Mat_Inscritos, {
  foreignKey: "id_horario",
  targetKey: "id",
});
Mat_Inscritos.belongsTo(Horario, {
  foreignKey: "id_horario",
  targetKey: "id",
});
Mat_Inscritos.belongsTo(Grupo, {
  foreignKey: "id_grupo",
  targetKey: "id",
});

Grupo.hasMany(Mat_Inscritos, {
  foreignKey: "id_grupo",
  targetKey: "id",
});

const Inscripcion = sequelize.define(
  "Inscripcion",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_alumno: { type: DataTypes.STRING(15), allowNull: false },
    fecha_hora_in: { type: DataTypes.DATE(6), allowNull: false },
    fecha_hora_cad: { type: DataTypes.DATE(6), allowNull: false },
  },
  { tableName: "inscripcion", timestamps: false }
);

Inscripcion.belongsTo(DatosPersonales, {
  foreignKey: "id_alumno",
  targetKey: "id",
});
DatosPersonales.hasOne(Inscripcion, {
  foreignKey: "id_alumno",
  targetKey: "id",
});

const Resena = sequelize.define(
  "Resena",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_profesor: { type: DataTypes.STRING(15), allowNull: false },
    id_alumno: { type: DataTypes.STRING(15), allowNull: false },
    calificacion: { type: DataTypes.FLOAT, allowNull: false },
    comentarios: { type: DataTypes.TEXT, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    periodo: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "resena", timestamps: false }
);

Resena.belongsTo(DatosPersonales, { foreignKey: "id_alumno", targetKey: "id" });
Resena.belongsTo(DatosPersonales, {
  foreignKey: "id_profesor",
  targetKey: "id",
});

const Kardex = sequelize.define(
  "Kardex",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_alumno: { type: DataTypes.STRING(15), allowNull: false },
    promedio: { type: DataTypes.FLOAT, allowNull: false },
    situacion_academica: { type: DataTypes.TEXT, allowNull: false },
    semestres_restantes: { type: DataTypes.INTEGER, allowNull: false },
    creditos_obtenidos: { type: DataTypes.FLOAT, allowNull: false },
  },
  { tableName: "kardex", timestamps: false }
);

Kardex.belongsTo(DatosPersonales, { foreignKey: "id_alumno", targetKey: "id" });
DatosPersonales.hasOne(Kardex, { foreignKey: "id_alumno", targetKey: "id" });

const UA_Aprobada = sequelize.define(
  "UA_Aprobada",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_kardex: { type: DataTypes.STRING(15), allowNull: false },
    unidad_aprendizaje: { type: DataTypes.TEXT, allowNull: false },
    calificacion_final: { type: DataTypes.FLOAT, allowNull: false },
    semestre: { type: DataTypes.INTEGER, allowNull: false },
    periodo: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    metodo_aprobado: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "ua_aprobada", timestamps: false }
);

UA_Aprobada.belongsTo(Kardex, { foreignKey: "id_kardex", targetKey: "id" });

const Borrador_Horario = sequelize.define(
  "Borrador_Horario",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_grupo: { type: DataTypes.STRING(15), allowNull: false },
    id_alumno: { type: DataTypes.STRING(15), allowNull: false },
    id_profesor: { type: DataTypes.STRING(15), allowNull: false },
    calificacion: { type: DataTypes.TEXT, allowNull: false },
    materia: { type: DataTypes.TEXT, allowNull: false },
    horas_lun: { type: DataTypes.TEXT, allowNull: true },
    horas_mar: { type: DataTypes.TEXT, allowNull: true },
    horas_mie: { type: DataTypes.TEXT, allowNull: true },
    horas_jue: { type: DataTypes.TEXT, allowNull: true },
    horas_vie: { type: DataTypes.TEXT, allowNull: true },
    creditos_necesarios: { type: DataTypes.FLOAT, allowNull: false },
    valido: { type: DataTypes.INTEGER, allowNull: false, defaultValue: true },
  },
  { tableName: "borrador_horario", timestamps: false }
);

Borrador_Horario.belongsTo(DatosPersonales, {
  foreignKey: "id_alumno",
  targetKey: "id",
  as: "alumno",
});
Borrador_Horario.belongsTo(DatosPersonales, {
  foreignKey: "id_profesor",
  targetKey: "id",
  as: "profesor",
});
Borrador_Horario.belongsTo(Grupo, {
  foreignKey: "id_grupo",
  targetKey: "id",
});

const Mensaje_Chat = sequelize.define(
  "Mensaje_Chat",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_usuario: { type: DataTypes.STRING(15), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    pregunta_realizada: { type: DataTypes.TEXT, allowNull: false },
    respuesta_obtenida: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "mensaje_chat", timestamps: false }
);

Mensaje_Chat.belongsTo(DatosPersonales, {
  foreignKey: "id_usuario",
  targetKey: "id",
});
DatosPersonales.hasMany(Mensaje_Chat, {
  foreignKey: "id_usuario",
  sourceKey: "id",
});

const Lista = sequelize.define(
  "Lista",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_inscrito: { type: DataTypes.STRING(15), allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    asistencia: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "lista", timestamps: false }
);

Lista.belongsTo(Mat_Inscritos, { foreignKey: "id_inscrito", targetKey: "id" });
Mat_Inscritos.hasMany(Lista, { foreignKey: "id_inscrito", targetKey: "id" });

const Contador = sequelize.define(
  "Contador",
  {
    id_profesor: { type: DataTypes.STRING(15), primaryKey: true },
    suma: { type: DataTypes.INTEGER, allowNull: false },
    registrados: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "contador", timestamps: false }
);

Contador.belongsTo(DatosPersonales, {
  foreignKey: "id_profesor",
  targetKey: "id",
});

const Materia_Reprobada = sequelize.define(
  "Materia_Reprobada",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_estudiante: { type: DataTypes.STRING(15), allowNull: false },
    id_ua: { type: DataTypes.STRING(15), allowNull: false },
    periodos_restantes: { type: DataTypes.INTEGER, allowNull: false },
    recurse: { type: DataTypes.INTEGER, allowNull: false },
    estado_actual: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "materia_reprobada", timestamps: false }
);

Materia_Reprobada.belongsTo(Estudiante, {
  foreignKey: "id_estudiante",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

Materia_Reprobada.belongsTo(Unidad_Aprendizaje, {
  foreignKey: "id_ua",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

Estudiante.hasMany(Materia_Reprobada, {
  foreignKey: "id_estudiante",
  sourceKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

Unidad_Aprendizaje.hasMany(Materia_Reprobada, {
  foreignKey: "id_ua",
  sourceKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

const ETS_grupo = sequelize.define(
  "ETS_Grupo",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_ua: { type: DataTypes.STRING(15), allowNull: false },
    id_aplicante: { type: DataTypes.STRING(15), allowNull: false },
    turno: { type: DataTypes.TEXT, allowNull: false },
    hora_inicio: { type: DataTypes.TEXT, allowNull: false },
    hora_final: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    periodo: { type: DataTypes.TEXT, allowNull: false },
    cupo: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "ets_grupo", timestamps: false }
);

ETS_grupo.belongsTo(Unidad_Aprendizaje, {
  foreignKey: "id_ua",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

Unidad_Aprendizaje.hasMany(ETS_grupo, {
  foreignKey: "id_ua",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
ETS_grupo.belongsTo(DatosPersonales, {
  foreignKey: "id_aplicante",
  targetKey: "id",
});
DatosPersonales.hasMany(ETS_grupo, {
  foreignKey: "id_aplicante",
  sourceKey: "id",
});

const ETS = sequelize.define(
  "ETS",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    id_mr: { type: DataTypes.STRING(15), allowNull: false },
    id_grupo: { type: DataTypes.STRING(15), allowNull: false },
    comprobante: { type: DataTypes.BLOB("long") },
    validado: { type: DataTypes.INTEGER, allowNull: false },
    calificado: { type: DataTypes.FLOAT, allowNull: false },
  },
  { tableName: "ets", timestamps: false }
);

ETS.belongsTo(ETS_grupo, {
  foreignKey: "id_grupo",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

ETS_grupo.hasMany(ETS, {
  foreignKey: "id_grupo",
  sourceKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

ETS.belongsTo(Materia_Reprobada, {
  foreignKey: "id_mr",
  targetKey: "id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});

const Avisos = sequelize.define(
  "Avisos",
  {
    id: { type: DataTypes.STRING(15), primaryKey: true },
    titulo: { type: DataTypes.TEXT, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    imagen: { type: DataTypes.BLOB("long"), allowNull: true },
    objetivo: { type: DataTypes.TEXT, allowNull: false },
    fecha_vencimiento: { type: DataTypes.DATE, allowNull: false },
  },
  { tableName: "avisos", timestamps: false }
);

const FechasRelevantes = sequelize.define(
  "FechasRelevantes",
  {
    inicio_semestre: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
    },
    fin_semestre: { type: DataTypes.DATE, allowNull: false },
    registro_primer_parcial: { type: DataTypes.DATE, allowNull: false },
    fin_registro_primer_parcial: { type: DataTypes.DATE, allowNull: false },
    registro_segundo_parcial: { type: DataTypes.DATE, allowNull: false },
    fin_registro_segundo_parcial: { type: DataTypes.DATE, allowNull: false },
    registro_tercer_parcial: { type: DataTypes.DATE, allowNull: false },
    fin_registro_tercer_parcial: { type: DataTypes.DATE, allowNull: false },
    registro_extra: { type: DataTypes.DATE, allowNull: false },
    fin_registro_extra: { type: DataTypes.DATE, allowNull: false },
    evalu_profe: { type: DataTypes.DATE, allowNull: false },
    fin_evalu_profe: { type: DataTypes.DATE, allowNull: false },
    inscribir_ets: { type: DataTypes.DATE, allowNull: false },
    fin_inscribir_ets: { type: DataTypes.DATE, allowNull: false },
    subir_doc_ets: { type: DataTypes.DATE, allowNull: false },
    fin_subir_doc_ets: { type: DataTypes.DATE, allowNull: false },
    eval_ets: { type: DataTypes.DATE, allowNull: false },
    fin_evalu_ets: { type: DataTypes.DATE, allowNull: false },
    periodo: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "fechas_relevantes", timestamps: false }
);

async function SincronizarModelo() {
  try {
    await DatosPersonales.sync();
    await DatosMedicos.sync();
    await Enfermedades.sync();
    await Estudiante.sync();
    await Unidad_Aprendizaje.sync();
    await Grupo.sync();
    await Distribucion.sync();
    await Horario.sync();
    await Mat_Inscritos.sync();
    await Inscripcion.sync();
    await Resena.sync();
    await Kardex.sync();
    await UA_Aprobada.sync();
    await Borrador_Horario.sync();
    await Mensaje_Chat.sync();
    await Lista.sync();
    await Contador.sync();
    await Materia_Reprobada.sync();
    await ETS_grupo.sync();
    await ETS.sync();
    await Avisos.sync();
    await FechasRelevantes.sync();
    console.log("Los modelos fueron sincronizados correctamente");
  } catch (err) {
    console.error("Error al sincronizar", err);
  }
}

DatosPersonales.prototype.validPassword = async function (password) {
  const result = bcrypt.compareSync(password, this.contrasena);
  console.log("Contraseña ingresada:", password);
  console.log("Resultado de comparación:", result);
  return result;
};

SincronizarModelo();

module.exports = {
  sequelize,
  DatosPersonales,
  DatosMedicos,
  Enfermedades,
  Estudiante,
  Unidad_Aprendizaje,
  Grupo,
  Distribucion,
  Horario,
  Mat_Inscritos,
  Inscripcion,
  Resena,
  Kardex,
  UA_Aprobada,
  Carrera,
  Borrador_Horario,
  Lista,
  Mensaje_Chat,
  Contador,
  Materia_Reprobada,
  ETS_grupo,
  ETS,
  Avisos,
  FechasRelevantes,
};