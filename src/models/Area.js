const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomeArea: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  icon: { 
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  hooks: {
    afterSync: async () => {
      try {
        const existingAreas = await Area.count();
        if (existingAreas === 0) {
          await Area.bulkCreate([
            { nomeArea: 'Saúde', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/syringe.png' },
            { nomeArea: 'Desporto', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/weight.png' },
            { nomeArea: 'Formação', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/formation.png' },
            { nomeArea: 'Gastronomia', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/gastronomy.png' },
            { nomeArea: 'Habitação/Alojamento', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/home.png' },
            { nomeArea: 'Transportes', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/car.png' },
            { nomeArea: 'Lazer', icon: 'https://backend-9hij.onrender.com/uploads/icons_area/cinema.png' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Área:', error);
      }
    }
  }
});

module.exports = Area;
