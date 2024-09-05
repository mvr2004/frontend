// models/Album.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Area = require('./Area');
const Subarea = require('./Subarea');
const Forum = require('./Forum');  // Importa o modelo Forum

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  forumId: {  // Adiciona a referência ao forum
    type: DataTypes.INTEGER,
    references: {
      model: Forum,
      key: 'id'
    },
    allowNull: false  // Um álbum deve estar sempre associado a um fórum
  }
}, {
  timestamps: false
});

Forum.hasMany(Album, { foreignKey: 'forumId' });  // Um fórum tem vários álbuns
Album.belongsTo(Forum, { foreignKey: 'forumId' });  // Um álbum pertence a um fórum

module.exports = Album;
