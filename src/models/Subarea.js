const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Area = require('./Area');

const Subarea = sequelize.define('Subarea', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomeSubarea: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  areaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Area,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  timestamps: false,
  hooks: {
    afterSync: async () => {
      try {
        const existingSubareas = await Subarea.count();
        if (existingSubareas === 0) {
          const areas = await Area.findAll();

          const subareasData = {
            'Saúde': [
              { nomeSubarea: 'Clínicas médicas e hospitais', areaId: areas.find(area => area.nomeArea === 'Saúde').id },
              { nomeSubarea: 'Clínicas dentárias', areaId: areas.find(area => area.nomeArea === 'Saúde').id },
              { nomeSubarea: 'Clínicas veterinárias', areaId: areas.find(area => area.nomeArea === 'Saúde').id },
            ],
            'Desporto': [
              { nomeSubarea: 'Ginásios', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
              { nomeSubarea: 'Futebol', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
              { nomeSubarea: 'Padle', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
              { nomeSubarea: 'Squash', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
              { nomeSubarea: 'Atletismo', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
              { nomeSubarea: 'Ciclismo', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
              { nomeSubarea: 'Karts', areaId: areas.find(area => area.nomeArea === 'Desporto').id },
            ],
            'Formação': [
              { nomeSubarea: 'Centros de Formação', areaId: areas.find(area => area.nomeArea === 'Formação').id },
              { nomeSubarea: 'Escolas', areaId: areas.find(area => area.nomeArea === 'Formação').id },
              { nomeSubarea: 'Infantários', areaId: areas.find(area => area.nomeArea === 'Formação').id }
            ],
            'Gastronomia': [
              { nomeSubarea: 'Restaurantes', areaId: areas.find(area => area.nomeArea === 'Gastronomia').id },
              { nomeSubarea: 'Shoppings', areaId: areas.find(area => area.nomeArea === 'Gastronomia').id },
            ],
            'Habitação/Alojamento': [
              { nomeSubarea: 'Quartos para arrendar', areaId: areas.find(area => area.nomeArea === 'Habitação/Alojamento').id },
              { nomeSubarea: 'Casas para alugar', areaId: areas.find(area => area.nomeArea === 'Habitação/Alojamento').id },
              { nomeSubarea: 'Casas de férias', areaId: areas.find(area => area.nomeArea === 'Habitação/Alojamento').id },
              { nomeSubarea: 'Escapadinhas', areaId: areas.find(area => area.nomeArea === 'Habitação/Alojamento').id },
            ],
            'Transportes': [
              { nomeSubarea: 'Boleias', areaId: areas.find(area => area.nomeArea === 'Transportes').id },
              { nomeSubarea: 'Transportes públicos', areaId: areas.find(area => area.nomeArea === 'Transportes').id },
            ],
            'Lazer': [
              { nomeSubarea: 'Cinema', areaId: areas.find(area => area.nomeArea === 'Lazer').id },
              { nomeSubarea: 'Parques', areaId: areas.find(area => area.nomeArea === 'Lazer').id },
            ]
          };

          for (const areaNome in subareasData) {
            const subareas = subareasData[areaNome];
            await Subarea.bulkCreate(subareas);
          }
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Subárea:', error);
      }
    }
  }
});

// Definindo a associação
Area.hasMany(Subarea, { foreignKey: 'areaId' });
Subarea.belongsTo(Area, { foreignKey: 'areaId' });

module.exports = Subarea;
