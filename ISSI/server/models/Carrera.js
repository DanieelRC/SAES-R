
module.exports = (sequelize, DataTypes) => {
  const Carrera = sequelize.define('Carrera', {
    nombre: { type: DataTypes.STRING, primaryKey: true },
    creditos_iniciales: { type: DataTypes.INTEGER, allowNull: false },
    prefijo: { type: DataTypes.STRING, allowNull: false },
    duracion_max: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'carrera',
    timestamps: false
  });

  return Carrera;
};
