const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Formulario = require('./Formulario');

const CampoFormulario = sequelize.define('CampoFormulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    opcoes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    formularioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Formulario,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingCampoFormulario = await CampoFormulario.count();
                if (existingCampoFormulario === 0) {
                    await CampoFormulario.bulkCreate([
                        {
                            nome: 'Qual o seu nome?',
                            tipo: 'text',
                            formularioId: 1,
                        },
                        {
                            nome: 'Traz comida?',
                            tipo: 'checkbox',
                            formularioId: 1,
                        },
                        {
                            nome: 'Se sim, escolha um tipo:',
                            tipo: 'dropdown',
                            opcoes: 'Carne, Peixe, Fruta, Vegetariano, Vegano',
                            formularioId: 1,
                        }
                        ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de CampoFormulario:', error);
            }
        }
    }
});

Formulario.hasMany(CampoFormulario, { foreignKey: 'formularioId' });
CampoFormulario.belongsTo(Formulario, { foreignKey: 'formularioId' });

module.exports = CampoFormulario;
