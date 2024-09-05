
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Subarea = require('./Subarea');
const Centro = require('./Centro');

const Estabelecimento = sequelize.define('Estabelecimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localizacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    precoMedio: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    linkLocalizacao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    subareaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subarea,
            key: 'id'
        }
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    centroId: { 
        type: DataTypes.INTEGER,
        references: {
            model: Centro,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingEstabelecimentos = await Estabelecimento.count();
                if (existingEstabelecimentos === 0) {
                    await Estabelecimento.bulkCreate([
                        {
                            nome: 'Restaurante do Migas',
                            localizacao: 'Rua das Flores, Figueira da Foz',
                            contacto: '+351 123 456 789',
                            descricao: 'Restaurante tradicional português',
                            pago: true,
                            foto: 'https://backend-9hij.onrender.com/uploads/locais/restaurante.jpg',
                            precoMedio: 25.5,
                            linkLocalizacao: 'https://maps.app.goo.gl/uuN8tPW133JLbMb77',
                            subareaId: 14, 
                            ativo: true, 
                            centroId: 1 
                        },
                        {
                            nome: 'Ginasio - Academia RamboDaSanta',
                            localizacao: 'Avenida S.Mamede, Santa Cruz da Trapa',
                            contacto: '+351 987 654 321',
                            descricao: 'Ginasio de musculação e fitness',
                            pago: true,
                            ativo: true,  
                            foto: 'https://backend-9hij.onrender.com/uploads/locais/ginasio.jpg',
                            precoMedio: 50.0,
                            linkLocalizacao: 'https://maps.app.goo.gl/jHifsMkowy8AHg1K6',
                            subareaId: 4, 
                            centroId: 1 
                        }
                    ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de Estabelecimento:', error);
            }
        }
    }
});

Subarea.hasMany(Estabelecimento, { foreignKey: 'subareaId' });
Estabelecimento.belongsTo(Subarea, { foreignKey: 'subareaId' });

Centro.hasMany(Estabelecimento, { foreignKey: 'centroId' });
Estabelecimento.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = Estabelecimento;