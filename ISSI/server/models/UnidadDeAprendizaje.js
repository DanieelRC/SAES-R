
module.exports = (sequelize, DataTypes) => {
  const UnidadDeAprendizaje = sequelize.define('UnidadDeAprendizaje', {
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    credito: { type: DataTypes.INTEGER, allowNull: false },
    carrera: { type: DataTypes.STRING, allowNull: false }, // FK a carrera.nombre
    semestre: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'unidad_de_aprendizaje',
    timestamps: false
  });

  return UnidadDeAprendizaje;
};
