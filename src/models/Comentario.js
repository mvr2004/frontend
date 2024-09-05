const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Utilizador = require('./Utilizador');
const Evento = require('./Evento');
const Forum = require('./Forum');
const Estabelecimento = require('./Estabelecimento');


const Comentario = sequelize.define('Comentario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  utilizadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilizador,
      key: 'id'
    }
  },
  eventoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Evento,
      key: 'id'
    },
    allowNull: true
  },
  forumId: {
    type: DataTypes.INTEGER,
    references: {
      model: Forum,
      key: 'id'
    },
    allowNull: true
  },
  estabelecimentoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Estabelecimento,
      key: 'id'
    },
    allowNull: true
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dislikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  denuncias: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true, 
});

// Associações
Utilizador.hasMany(Comentario, { foreignKey: 'utilizadorId' });
Comentario.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

Evento.hasMany(Comentario, { foreignKey: 'eventoId' });
Comentario.belongsTo(Evento, { foreignKey: 'eventoId' });

Forum.hasMany(Comentario, { foreignKey: 'forumId' });
Comentario.belongsTo(Forum, { foreignKey: 'forumId' });

Estabelecimento.hasMany(Comentario, { foreignKey: 'estabelecimentoId' });
Comentario.belongsTo(Estabelecimento, { foreignKey: 'estabelecimentoId' });

module.exports = Comentario;
