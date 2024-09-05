const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Formulario = sequelize.define('Formulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingFormularios = await Formulario.count();
                if (existingFormularios === 0) {
                    await Formulario.bulkCreate([
                        {
                            nome: 'Formulário dos Baloiços',
                            eventoId: 3,
                            ativo: true,
                            publicado: false,
                        }
                        ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de Formulario:', error);
            }
        }
    }
});



module.exports = Formulario;
