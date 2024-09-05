const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const bcrypt = require('bcrypt');
const Centro = require('./Centro'); // Importação do modelo Centro

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isMaster: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('master', 'admin'),
    defaultValue: 'admin'
  },
  centroId: {
    type: DataTypes.INTEGER,
    references: {
      model: Centro,
      key: 'id'
    },
    allowNull: true
  }
}, {
  timestamps: false,
  hooks: {
    beforeCreate: async (admin) => {
      // Verifica se a senha já está criptografada
      if (admin.password.length < 60) { // Comprimento típico de hash bcrypt
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        // Verifica se a senha já está criptografada
        if (admin.password.length < 60) { // Comprimento típico de hash bcrypt
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      }
    },
    afterSync: async () => {
      try {
        const existingMasterAdmin = await Admin.findOne({ where: { isMaster: true } });
        if (!existingMasterAdmin) {
          const masterAdmin = await Admin.create({
            nome: 'Master Admin',
            password: await bcrypt.hash('123', 10), // Criptografar a senha padrão
            isMaster: true,
            role: 'master'
          });
          console.log('Admin Master criado:', masterAdmin);
        }

        // Criar admins para centros existentes
        const centros = await Centro.findAll();
        for (const centro of centros) {
          const existingAdmin = await Admin.findOne({ where: { centroId: centro.id } });
          if (!existingAdmin) {
            const newAdmin = await Admin.create({
              nome: `Admin ${centro.centro}`,
              password: await bcrypt.hash('123', 10), // Criptografar a senha padrão
              role: 'admin',
              centroId: centro.id
            });
            console.log(`Admin criado para o centro ${centro.centro}:`, newAdmin);
          }
        }
      } catch (error) {
        console.error('Erro ao criar admins para centros:', error);
      }
    }
  }
});

// Definindo a relação Admin -> Centro
Admin.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = Admin;
