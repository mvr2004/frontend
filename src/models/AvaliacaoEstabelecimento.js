const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const User = require('./Utilizador');
const Estabelecimento = require('./Estabelecimento');

const AvEstabelecimento = sequelize.define('AvEstabelecimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    estabelecimentoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Estabelecimento,
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
    hooks: {
        afterSync: async () => {
            try {
                const existingAvEstabelecimentos = await AvEstabelecimento.count();
                if (existingAvEstabelecimentos === 0) {
                    await AvEstabelecimento.bulkCreate([
                        { userId: 1, estabelecimentoId: 1, rating: 4 },
                        { userId: 2, estabelecimentoId: 1, rating: 5 },
                        { userId: 2, estabelecimentoId: 2, rating: 3 },
                        { userId: 1, estabelecimentoId: 2, rating: 2 }
                    ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de Avaliação de Estabelecimento:', error);
            }
        }
    }
});

User.hasMany(AvEstabelecimento, { foreignKey: 'userId' });
AvEstabelecimento.belongsTo(User, { foreignKey: 'userId' });

Estabelecimento.hasMany(AvEstabelecimento, { foreignKey: 'estabelecimentoId' });
AvEstabelecimento.belongsTo(Estabelecimento, { foreignKey: 'estabelecimentoId' });

module.exports = AvEstabelecimento;