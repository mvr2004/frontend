const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const CampoFormulario = require('./CampoFormulario');
const Utilizador = require('./Utilizador');

const RespostaFormulario = sequelize.define('RespostaFormulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    resposta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    campoFormularioId: {
        type: DataTypes.INTEGER,
        references: {
            model: CampoFormulario,
            key: 'id'
        }
    },
    utilizadorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizador,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingRespostaFormulario = await RespostaFormulario.count();
                if (existingRespostaFormulario === 0) {
                    await RespostaFormulario.bulkCreate([
                        {
                            resposta: 'Vicente',
                            campoFormularioId: 1,
                            utilizadorId: 1,
                        },
                        {
                            resposta: 'true',
                            campoFormularioId: 2,
                            utilizadorId: 4,
                        },
                        {
                            resposta: 'Carne',
                            campoFormularioId: 3,
                            utilizadorId: 4,
                        },
                        {
                            resposta: 'Carolina',
                            campoFormularioId: 1,
                            utilizadorId: 5,
                        },
                        {
                            resposta: 'true',
                            campoFormularioId: 2,
                            utilizadorId: 5,
                        },
                        {
                            resposta: 'Vegetariano',
                            campoFormularioId: 3,
                            utilizadorId: 5,
                        }
                        ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de RespostaFormulario:', error);
            }
        }
    }
});

CampoFormulario.hasMany(RespostaFormulario, { foreignKey: 'campoFormularioId' });
RespostaFormulario.belongsTo(CampoFormulario, { foreignKey: 'campoFormularioId' });

Utilizador.hasMany(RespostaFormulario, { foreignKey: 'utilizadorId' });
RespostaFormulario.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

module.exports = RespostaFormulario;
