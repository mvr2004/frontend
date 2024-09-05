const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Centro = sequelize.define('Centro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  centro: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fotos: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true // Novo campo para indicar se o centro está ativo
  }
}, {
  timestamps: false,
  hooks: {
    afterSync: async () => {
      try {
        const existingCentros = await Centro.count();
        if (existingCentros === 0) {
          await Centro.bulkCreate([
            { centro: 'Viseu', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_viseu.png' },
            { centro: 'Tomar', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_santarem.png' },
            { centro: 'Fundao', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_castelo-branco.png' },
            { centro: 'Portalegre', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_portalegre.png' },
            { centro: 'Vila Real', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_vila-real.png' },
            { centro: 'Lisboa', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_lisboa.png' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Centro:', error);
      }
    }
  }
});

module.exports = Centro;
