const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Album = require('./Album');
const User = require('./Utilizador');  

const Foto = sequelize.define('Foto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  albumId: {
    type: DataTypes.INTEGER,
    references: {
      model: Album,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false // Desativa os timestamps automáticos do Sequelize
});

// Definir relações
Album.hasMany(Foto, { foreignKey: 'albumId' });
Foto.belongsTo(Album, { foreignKey: 'albumId' });

User.hasMany(Foto, { foreignKey: 'userId' });
Foto.belongsTo(User, { foreignKey: 'userId' });

module.exports = Foto;
