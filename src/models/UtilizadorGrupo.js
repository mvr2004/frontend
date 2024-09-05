const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Utilizador = require('./Utilizador');
const Grupo = require('./Grupo');

const UtilizadorGrupo = sequelize.define('UtilizadorGrupo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  utilizadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilizador,
      key: 'id',
    },
  },
  grupoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Grupo,
      key: 'id',
    },
  },
}, {
  timestamps: false,
});

// Associações
Utilizador.belongsToMany(Grupo, { through: UtilizadorGrupo, foreignKey: 'utilizadorId' });
Grupo.belongsToMany(Utilizador, { through: UtilizadorGrupo, foreignKey: 'grupoId' });

module.exports = UtilizadorGrupo;
