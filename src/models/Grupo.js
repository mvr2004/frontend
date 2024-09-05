const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Area = require('./Area');

// Definição do modelo Grupo
const Grupo = sequelize.define('Grupo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  areaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Area,
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Associações
Area.hasMany(Grupo, { foreignKey: 'areaId' });
Grupo.belongsTo(Area, { foreignKey: 'areaId' });

module.exports = Grupo;
