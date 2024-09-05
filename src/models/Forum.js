const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Area = require('./Area');
const Subarea = require('./Subarea');
const Centro = require('./Centro'); // Importando o modelo Centro

const Forum = sequelize.define('Forum', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  regras: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  areaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Area,
      key: 'id',
    },
    allowNull: true,
  },
  subareaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subarea,
      key: 'id',
    },
    allowNull: true,
  },
  centroId: {
    type: DataTypes.INTEGER,
    references: {
      model: Centro,
      key: 'id',
    },
    allowNull: true,
  },
  ativo: { // Novo campo "ativo"
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Valor padrão: ativo
    allowNull: false,
  },
}, {
  timestamps: false,
});

// Associações
Area.hasMany(Forum, { foreignKey: 'areaId' });
Forum.belongsTo(Area, { foreignKey: 'areaId' });

Subarea.hasMany(Forum, { foreignKey: 'subareaId' });
Forum.belongsTo(Subarea, { foreignKey: 'subareaId' });

Centro.hasMany(Forum, { foreignKey: 'centroId' });
Forum.belongsTo(Centro, { foreignKey: 'centroId' });

Forum.afterSync(async () => {
  try {
    const existingForums = await Forum.count();
    if (existingForums === 0) {
      const areas = await Area.findAll();
      for (const area of areas) {
        await Forum.create({
          titulo: `Fórum de ${area.nomeArea}`,
          descricao: `Discussões relacionadas à área de ${area.nomeArea}`,
          regras: `Regras para o fórum de ${area.nomeArea}`,
          areaId: area.id,
          subareaId: null,
          centroId: null,
          ativo: true, // Novo campo "ativo"
        });
      }
    }
  } catch (error) {
    console.error('Erro ao criar fóruns para as áreas:', error);
  }
});

module.exports = Forum;
