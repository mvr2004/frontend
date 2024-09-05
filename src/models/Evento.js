const { DataTypes, Op } = require('sequelize');
const sequelize = require('../configs/database');
const Subarea = require('./Subarea');
const Utilizador = require('./Utilizador');
const Centro = require('./Centro');
const Grupo = require('./Grupo');  // Importa o modelo Grupo

// Definição do modelo Evento
const Evento = sequelize.define('Evento', {
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
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    subareaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subarea,
            key: 'id'
        }
    },
    utilizadorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizador,
            key: 'id'
        }
    },
    maxParticipantes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    centroId: {
        type: DataTypes.INTEGER,
        references: {
            model: Centro,
            key: 'id'
        }
    },
    grupoId: {  // Adiciona a referência ao grupo
        type: DataTypes.INTEGER,
        references: {
            model: Grupo,
            key: 'id'
        },
        allowNull: true  // Permite que o evento não esteja associado a um grupo
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // Não publicado por padrão
    },
    linkComunicacao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkLocalizacao: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true  // Valida se o valor é uma URL válida
        }
    }
}, {  
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingEventos = await Evento.count();
                if (existingEventos === 0) {
                    await Evento.bulkCreate([
                        {
                            nome: 'Jogar uma futebolada',
                            localizacao: 'Campo de jogos Almeida Sobrinho, Santa Cruz da Trapa',
                            data: '2024-08-15',
                            hora: '10:00:00',
                            descricao: 'Venha jogar a bola connosco',
                            ativo: true,
                            publicado: true,
                            subareaId: 3, 
                            utilizadorId: 1, 
                            centroId: 1,
                            linkLocalizacao: 'https://maps.app.goo.gl/tziafRHpyqCLnim97',
                            foto: 'https://blog.mygon.com/wp-content/uploads/2015/10/golo_MYGON-1.png',
                        },
                        {
                            nome: 'Evento de karts',
                            localizacao: 'Vila Nova do Paiva',
                            data: '2024-09-20',
                            hora: '14:30:00',
                            descricao: 'Venha connosco acelerar e sentir o cheiro a gasolina em Vila Nova Do Paiva',
                            ativo: true,
                            publicado: true,
                            subareaId: 10, 
                            utilizadorId: 1, 
                            centroId: 1,
                            maxParticipantes: 10,
                            linkLocalizacao: 'https://maps.app.goo.gl/NrUeu6csvyz2EkHMA',
                            foto: 'https://offloadmedia.feverup.com/madridsecreto.co/wp-content/uploads/2022/12/27165528/shutterstock_2171045113-1-1024x683.jpg',
                        },
                        {
                            nome: 'Diversão nos Baloiços',
                            localizacao: 'Jardim Municipal, Figueira da Foz',
                            data: '2024-10-31',
                            hora: '15:30:00',
                            descricao: 'Vamos lembrar os velhos tempos e andar nos Baloiços no meu aniversário',
                            ativo: true,
                            publicado: true,
                            subareaId: 23, 
                            utilizadorId: 2, 
                            centroId: 1,
                            linkLocalizacao: 'https://maps.app.goo.gl/VFXsjopjBqivc46D8',
                            foto: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/69/76/2a/caption.jpg?w=1200&h=-1&s=1',
                        }
                    ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de Evento:', error);
            }
        },
        // Hook para desativar eventos cuja data já passou
        beforeFind: async (options) => {
            const currentDate = new Date();

            // Desativa todos os eventos cuja data já passou e ainda estão ativos
            await Evento.update({ ativo: false }, {
                where: {
                    data: {
                        [Op.lt]: currentDate, // Data menor que a atual (eventos passados)
                    },
                    ativo: true // Apenas desativa eventos que ainda estão ativos
                }
            });
        }
    }
});

// Associações
Subarea.hasMany(Evento, { foreignKey: 'subareaId' });
Evento.belongsTo(Subarea, { foreignKey: 'subareaId' });

Utilizador.hasMany(Evento, { foreignKey: 'utilizadorId' });
Evento.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

Centro.hasMany(Evento, { foreignKey: 'centroId' });
Evento.belongsTo(Centro, { foreignKey: 'centroId' });

Grupo.hasMany(Evento, { foreignKey: 'grupoId' });  // Opcional se você precisar que Grupo tenha muitos Eventos
Evento.belongsTo(Grupo, { foreignKey: 'grupoId' });  // Necessário para associar Eventos a Grupos

module.exports = Evento;
