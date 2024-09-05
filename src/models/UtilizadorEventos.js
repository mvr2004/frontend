const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Utilizador = require('./Utilizador');
const Evento = require('./Evento');

const ParticipacaoEvento = sequelize.define('ParticipacaoEvento', {
    utilizadorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizador,
            key: 'id'
        }
    },
    eventoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Evento,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingParticipacoes = await ParticipacaoEvento.count();
                if (existingParticipacoes === 0) {
                    await ParticipacaoEvento.bulkCreate([
                        {
                            utilizadorId: 1, 
                            eventoId: 3 
                        },
						{
                            utilizadorId: 5, 
                            eventoId: 3
                        },
						{
                            utilizadorId: 3, 
                            eventoId: 1 
                        },
						{
                            utilizadorId: 1, 
                            eventoId: 2 
                        },
						
                        {
                            utilizadorId: 2, 
                            eventoId: 2 
                        }
                        
                    ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de ParticipacaoEvento:', error);
            }
        }
    }
});

Utilizador.belongsToMany(Evento, { through: ParticipacaoEvento, foreignKey: 'utilizadorId' });
Evento.belongsToMany(Utilizador, { through: ParticipacaoEvento, foreignKey: 'eventoId' });

module.exports = ParticipacaoEvento;
