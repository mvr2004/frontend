const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Utilizador = require('./Utilizador');
const Comentario = require('./Comentario');

const InteracaoComentario = sequelize.define('InteracaoComentario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false
  },
  utilizadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilizador,
      key: 'id'
    },
    allowNull: false
  },
  comentarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Comentario,
      key: 'id'
    },
    allowNull: false
  }
}, {
  timestamps: false
});

Utilizador.hasMany(InteracaoComentario, { foreignKey: 'utilizadorId' });
Comentario.hasMany(InteracaoComentario, { foreignKey: 'comentarioId' });

module.exports = InteracaoComentario;
