const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Centro = require('./Centro');
const bcrypt = require('bcrypt');

const Utilizador = sequelize.define('Utilizador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fotoUrl: {
    type: DataTypes.STRING
  },
  Ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  confirmationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deviceToken: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  centroId: {
    type: DataTypes.INTEGER,
    references: {
      model: Centro,
      key: 'id'
    }
  }
}, {
  timestamps: false, // Removido timestamps
  hooks: {

    // Inserir dados pré-definidos após a sincronização inicial
    afterSync: async () => {
      try {
        const existingUtilizadors = await Utilizador.count();
        if (existingUtilizadors === 0) {
          const salt = await bcrypt.genSalt(10);
          await Utilizador.bulkCreate([
            {
              nome: 'Marco Vicente',
              email: 'marcovicente@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 1, 
            },
            {
              nome: 'Miguel Silva',
              email: 'DaSilvinha@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 1,
            },
            {
              nome: 'Adriana Silva',
              email: 'adrianasilvs@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2, 
            },
            {
              nome: 'Roberto Macedo',
              email: 'macedex@example.com',
              password: await bcrypt.hash('saudadesmeuprimo', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2, 
            },
            {
              nome: 'Carolina Vasconcelos',
              email: 'vasconcelos@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2, 
            },
            {
              nome: 'Antonio Vicente',
              email: 'vicente.jr@example.com',
              password: await bcrypt.hash('futuroMiudOsENSAÇÃO', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2, 
            },
            {
              nome: 'Diogo Vicente',
              email: 'vice10@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2, 
            },
            {
              nome: 'João Silva',
              email: 'john.silvs@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: false,
              notas: 'Despediu-se e tratou mal o chefe',
              centroId: 1, 
            },
            {
              nome: 'Jane Smith',
              email: 'jane.smith@example.com',
              password: await bcrypt.hash('senhasupersegura', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2,
            },
            {
              nome: 'Maria Silva',
              email: 'maria.silva@example.com',
              password: await bcrypt.hash('senhaMariaSilva', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2,
            },
            {
              nome: 'Carlos Santos',
              email: 'carlos.santos@example.com',
              password: await bcrypt.hash('senhaCarlosSantos', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 1,
            },
            {
              nome: 'Ana Oliveira',
              email: 'ana.oliveira@example.com',
              password: await bcrypt.hash('senhaAnaOliveira', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2,
            },
            {
              nome: 'Pedro Rodrigues',
              email: 'pedro.rodrigues@example.com',
              password: await bcrypt.hash('senhaPedroRodrigues', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2,
            },
            {
              nome: 'Sofia Costa',
              email: 'sofia.costa@example.com',
              password: await bcrypt.hash('senhaSofiaCosta', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 1,
            },
            {
              nome: 'Miguel Ferreira',
              email: 'miguel.ferreira@example.com',
              password: await bcrypt.hash('senhaMiguelFerreira', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2,
            },
            {
              nome: 'Beatriz Almeida',
              email: 'beatriz.almeida@example.com',
              password: await bcrypt.hash('senhaBeatrizAlmeida', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 1,
            },
            {
              nome: 'Rui Gomes',
              email: 'rui.gomes@example.com',
              password: await bcrypt.hash('senhaRuiGomes', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 1,
            },
            {
              nome: 'Joana Sousa',
              email: 'joana.sousa@example.com',
              password: await bcrypt.hash('senhaJoanaSousa', salt),
              fotoUrl: 'https://backend-9hij.onrender.com/uploads/default_images/profile.jpg',
              Ativo: true,
              centroId: 2,
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Utilizador:', error);
      }
    }
  }
});

Utilizador.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = Utilizador;
