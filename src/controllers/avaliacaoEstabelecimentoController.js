// src/controllers/avaliacaoEstabelecimentoController.js
const sequelize = require('../configs/database');
const User = require('../models/Utilizador');
const Estabelecimento = require('../models/Estabelecimento');
const AvEstabelecimento = require('../models/AvaliacaoEstabelecimento');

// Controlador para criar ou atualizar uma avaliação de estabelecimento
const createEstabelecimentoReview = async (req, res, next) => {
  try {
    const { userId, estabelecimentoId, rating } = req.body;

    // Verifica se o usuário e o estabelecimento existem
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('Usuário não encontrado com id:', userId);
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    const estabelecimento = await Estabelecimento.findByPk(estabelecimentoId);
    if (!estabelecimento) {
      console.log('Estabelecimento não encontrado com id:', estabelecimentoId);
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }

    // Verifica se já existe uma avaliação para o par userId e estabelecimentoId
    const existingReview = await AvEstabelecimento.findOne({
      where: { userId, estabelecimentoId }
    });

    if (existingReview) {
      // Atualiza a avaliação existente
      existingReview.rating = rating;
      await existingReview.save();
      res.status(200).json({ review: existingReview });
    } else {
      // Cria uma nova avaliação de estabelecimento
      const review = await AvEstabelecimento.create({
        userId,
        estabelecimentoId,
        rating
      });
      res.status(201).json({ review });
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar avaliação de estabelecimento:', error);
    next(error);
  }
};

// Controlador para listar as avaliações de um estabelecimento
const listEstabelecimentoReviews = async (req, res, next) => {
  const { estabelecimentoId } = req.params;
  try {
    console.log('Listing reviews for establishment:', estabelecimentoId);

    // Busca todas as avaliações para o estabelecimento específico
    const reviews = await AvEstabelecimento.findAll({
      where: { estabelecimentoId },
      include: [{ model: User, attributes: ['id', 'name'] }] // Inclui o nome do usuário na resposta
    });

    console.log('Found reviews:', reviews);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: 'Nenhuma avaliação encontrada para este estabelecimento.' });
    }

    res.json({ reviews });
  } catch (error) {
    console.error('Erro ao buscar avaliações de estabelecimento:', error);
    next(error);
  }
};

const calculateEstabelecimentoAverageRating = async (req, res, next) => {
  const { establishmentId } = req.params; // Verifique se você está usando 'establishmentId' aqui, conforme definido na rota
  try {
    console.log('Calculating average rating and review count for establishment:', establishmentId);

    const result = await AvEstabelecimento.findAll({
      where: { estabelecimentoId: establishmentId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'reviewCount']
      ],
      raw: true
    });

    console.log('Calculated average rating and review count:', result);

    if (!result || result.length === 0 || result[0].averageRating === null) {
      return res.json({ 
        averageRating: 0,
        reviewCount: 0
      });
    }

    res.json({ 
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    });
  } catch (error) {
    console.error('Erro ao calcular média das avaliações e contagem de avaliações do estabelecimento:', error);
    next(error);
  }
};


module.exports = {
  createEstabelecimentoReview,
  listEstabelecimentoReviews,
  calculateEstabelecimentoAverageRating,
};
