const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./User');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assunto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descriscao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resolvido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: false, // Disable timestamps
  hooks: {
    // Inserir dados pré-definidos após a sincronização
    afterSync: async () => {
      try {
        // Exemplo de inserção de dados pré-definidos
        await Report.bulkCreate([
		   {
            assunto: 'Imagem não atualiza',
            descriscao: 'Eu mudei a minha imagem de perfil e esta não atualiza',
            imageUrl: 'https://backend-9hij.onrender.com/uploads/reports/report1.jpg',
            resolvido: false,
            userId: 2
          },
          {
            assunto: 'Oh Miguel pah',
            descriscao: 'Endirei-te me isso na aplicação pah, ta tudo mal feito. Logo já te vou ajudar a compor isso e fazer mais umas coisitas.',
            imageUrl: 'https://backend-9hij.onrender.com/uploads/reports/report2.jpg',
            resolvido: false,
            userId: 1
          },
          {
            assunto: 'Problema no sistema de pagamento',
            descriscao: 'falhas ao realizar pagamentos online.',
            resolvido: false,
            userId: 8
          },
          {
            assunto: 'Erro de conexão com o servidor',
            descriscao: 'Problemas ao conectar com o servidor.',
            resolvido: false,
            userId: 2
          },
          {
            assunto: 'Problema com a interface de utilizador',
            descriscao: 'Tenho a recalamção dedificuldades na navegação pela nova interface.',
            resolvido: true,
            userId: 5
          },
          {
            assunto: 'Problema de segurança detectado',
            descriscao: 'Foi identificada uma vulnerabilidade no sistema de autenticação.',
            resolvido: false,
            userId: 3
          }
        ]);
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Report:', error);
      }
    }
  }
});

Report.belongsTo(User, { foreignKey: 'userId' });

module.exports = Report;