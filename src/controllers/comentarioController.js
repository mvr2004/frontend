const { Sequelize } = require('sequelize');
const Comentario = require('../models/Comentario');
const InteracaoComentario = require('../models/InteracaoComentario');
const Evento = require('../models/Evento');
const Forum = require('../models/Forum');
const Utilizador = require('../models/Utilizador'); 

// Função para dar like em um comentário
const likeComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { utilizadorId } = req.body;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    const interacao = await InteracaoComentario.findOne({
      where: { comentarioId: id, utilizadorId }
    });

    if (interacao) {
      if (interacao.tipo === 'like') {
        return res.status(400).json({ error: 'Você já deu like neste comentário.' });
      } else if (interacao.tipo === 'dislike') {
        comentario.dislikes -= 1;
        comentario.likes += 1;
        interacao.tipo = 'like';
        await interacao.save();
      }
    } else {
      comentario.likes += 1;
      await InteracaoComentario.create({ comentarioId: id, utilizadorId, tipo: 'like' });
    }

    await comentario.save();
    res.json({ comentario });
  } catch (error) {
    console.error('Erro ao dar like no comentário:', error);
    next(error);
  }
};

// Função para dar dislike em um comentário
const dislikeComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { utilizadorId } = req.body;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    const interacao = await InteracaoComentario.findOne({
      where: { comentarioId: id, utilizadorId }
    });

    if (interacao) {
      if (interacao.tipo === 'dislike') {
        return res.status(400).json({ error: 'Você já deu dislike neste comentário.' });
      } else if (interacao.tipo === 'like') {
        comentario.likes -= 1;
        comentario.dislikes += 1;
        interacao.tipo = 'dislike';
        await interacao.save();
      }
    } else {
      comentario.dislikes += 1;
      await InteracaoComentario.create({ comentarioId: id, utilizadorId, tipo: 'dislike' });
    }

    await comentario.save();
    res.json({ comentario });
  } catch (error) {
    console.error('Erro ao dar dislike no comentário:', error);
    next(error);
  }
};

// Função para denunciar um comentário
const denunciarComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    comentario.denuncias += 1;
    await comentario.save();

    res.json({ comentario });
  } catch (error) {
    console.error('Erro ao denunciar o comentário:', error);
    next(error);
  }
};

// Função para ativar ou desativar um comentário
const toggleComentarioAtivo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    comentario.ativo = !comentario.ativo;
    await comentario.save();

    res.json({ comentario });
  } catch (error) {
    console.error('Erro ao ativar/desativar o comentário:', error);
    next(error);
  }
};

// Função para buscar comentários por ID
const getComentarioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido. Deve ser um número inteiro.' });
    }

    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    res.json({ comentario });
  } catch (error) {
    console.error('Erro ao buscar comentário por ID:', error);
    next(error);
  }
};


// Função para buscar todos os comentários
const getAllComentarios = async (req, res, next) => {
  try {
    const comentarios = await Comentario.findAll();
    res.json({ comentarios });
  } catch (error) {
    console.error('Erro ao buscar todos os comentários:', error);
    next(error);
  }
};

const getComentariosPorPublicarDoCentro = async (req, res, next) => {
  try {
    const { centroId } = req.params;

    if (isNaN(centroId)) {
      return res.status(400).json({ error: 'ID do centro inválido. Deve ser um número inteiro.' });
    }

    const comentarios = await Comentario.findAll({
      where: {
        ativo: false,
        [Sequelize.Op.or]: [
          { eventoId: { [Sequelize.Op.not]: null } },
          { forumId: { [Sequelize.Op.not]: null } }
        ]
      },
      include: [
        {
          model: Evento,
          attributes: ['nome', 'centroId'],
          required: false,
          where: { centroId }
        },
        {
          model: Forum,
          attributes: ['titulo', 'centroId'],
          required: false,
          where: {
            [Sequelize.Op.or]: [
              { centroId: centroId },
              { centroId: null }
            ]
          }
        },
        {
          model: Utilizador,
          attributes: ['nome'], // Inclui apenas o nome do utilizador
        },
      ]
    });

    const comentariosComTipo = comentarios.map(comentario => {
      const tipo = comentario.eventoId ? 'evento' : comentario.forumId ? 'forum' : 'desconhecido';
      const nome = comentario.eventoId 
          ? comentario.Evento?.nome 
          : comentario.forumId 
              ? comentario.Forum?.titulo 
              : null;
      const nomeUtilizador = comentario.Utilizador?.nome || 'Desconhecido'; // Nome do utilizador

      return { ...comentario.toJSON(), tipo, nome, nomeUtilizador };
    });

    res.json({ comentarios: comentariosComTipo });
  } catch (error) {
    console.error('Erro ao buscar comentários por publicar do centro:', error);
    next(error);
  }
};

const getComentariosPublicadosDoCentro = async (req, res, next) => {
  try {
    const { centroId } = req.params;

    if (isNaN(centroId)) {
      return res.status(400).json({ error: 'ID do centro inválido. Deve ser um número inteiro.' });
    }

    const comentarios = await Comentario.findAll({
      where: { ativo: true },
      include: [
        {
          model: Evento,
          attributes: ['nome', 'centroId'],
          required: false,
          where: { centroId }
        },
        {
          model: Forum,
          attributes: ['titulo', 'centroId'],
          required: false,
          where: {
            [Sequelize.Op.or]: [
              { centroId: centroId },
              { centroId: null }
            ]
          }
        },
        {
          model: Utilizador,
          attributes: ['nome'], // Inclui apenas o nome do utilizador
        },
      ],
      order: [['denuncias', 'DESC']], // Ordena por número de denúncias em ordem decrescente
    });

    const comentariosComTipo = comentarios.map(comentario => {
      const tipo = comentario.eventoId ? 'evento' : comentario.forumId ? 'forum' : 'desconhecido';
      const nome = comentario.eventoId 
          ? comentario.Evento?.nome 
          : comentario.forumId 
              ? comentario.Forum?.titulo 
              : null;
      const nomeUtilizador = comentario.Utilizador?.nome || 'Desconhecido'; // Nome do utilizador

      return { 
        ...comentario.toJSON(), 
        tipo, 
        nome, 
        nomeUtilizador, 
        denuncias: comentario.denuncias // Adiciona o número de denúncias no resultado
      };
    });

    res.json({ comentarios: comentariosComTipo });
  } catch (error) {
    console.error('Erro ao buscar comentários publicados do centro:', error);
    next(error);
  }
};


// Função para ativar um comentário pendente
const ativarComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    if (comentario.ativo) {
      return res.status(400).json({ error: 'Comentário já está ativado.' });
    }

    comentario.ativo = true;
    await comentario.save();

    res.json({ comentario });
  } catch (error) {
    console.error('Erro ao ativar o comentário:', error);
    next(error);
  }
};


// Função para eliminar um comentário
const eliminarComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    await comentario.destroy();

    res.json({ message: 'Comentário eliminado com sucesso.' });
  } catch (error) {
    console.error('Erro ao eliminar o comentário:', error);
    next(error);
  }
};

// Função para resetar denúncias de um comentário
const resetarDenunciasComentario = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verifica se o comentário existe
    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    // Reseta as denúncias do comentário
    comentario.denuncias = 0;
    await comentario.save();

    res.json({ message: 'Denúncias do comentário foram resetadas com sucesso.', comentario });
  } catch (error) {
    console.error('Erro ao resetar as denúncias do comentário:', error);
    next(error);
  }
};


// Função para contar comentários ativos de um centro
const countComentariosAtivos = async (req, res, next) => {
  try {
    const { centroId } = req.params;

    const count = await Comentario.count({
      where: { ativo: true },
      include: [
        {
          model: Evento,
          where: { centroId },
          required: false
        },
        {
          model: Forum,
          where: { centroId },
          required: false
        }
      ]
    });

    res.json({ count });
  } catch (error) {
    console.error('Erro ao contar comentários ativos:', error);
    next(error);
  }
};

// Função para contar comentários inativos de um centro
const countComentariosInativos = async (req, res, next) => {
  try {
    const { centroId } = req.params;

    const count = await Comentario.count({
      where: { ativo: false },
      include: [
        {
          model: Evento,
          where: { centroId },
          required: false
        },
        {
          model: Forum,
          where: { centroId },
          required: false
        }
      ]
    });

    res.json({ count });
  } catch (error) {
    console.error('Erro ao contar comentários inativos:', error);
    next(error);
  }
};

// Função para contar o total de denúncias de um centro
const countDenunciasComentarios = async (req, res, next) => {
  try {
    const { centroId } = req.params;

    const denuncias = await Comentario.sum('denuncias', {
      include: [
        {
          model: Evento,
          where: { centroId },
          required: false
        },
        {
          model: Forum,
          where: { centroId },
          required: false
        }
      ]
    });

    res.json({ denuncias });
  } catch (error) {
    console.error('Erro ao contar denúncias de comentários:', error);
    next(error);
  }
};



module.exports = {
  likeComentario,
  dislikeComentario,
  denunciarComentario,
  toggleComentarioAtivo,
  getComentarioById,
  getAllComentarios,
  getComentariosPublicadosDoCentro,
  getComentariosPorPublicarDoCentro,
  ativarComentario,
  eliminarComentario,
  resetarDenunciasComentario,
  countComentariosAtivos,
  countComentariosInativos,
  countDenunciasComentarios,
  
};