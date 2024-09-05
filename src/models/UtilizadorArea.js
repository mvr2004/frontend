const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./Utilizador');
const Area = require('./Area');

const UserArea = sequelize.define('UserArea', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
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

// Definindo a associação muitos-para-muitos
User.belongsToMany(Area, { through: UserArea, foreignKey: 'userId' });
Area.belongsToMany(User, { through: UserArea, foreignKey: 'areaId' });

module.exports = UserArea;