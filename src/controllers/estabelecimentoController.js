// controllers/establishmentController.js

const Estabelecimento = require('../models/Estabelecimento');
const upload = require('../configs/multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const estabelecimentoService = require('../services/estabelecimentoService');

const createEstablishment = async (req, res, next) => {
  try {
    const { nome, localizacao, contacto, descricao, pago, precoMedio, linkLocalizacao, subareaId, centroId } = req.body;

    if (!nome || !localizacao) {
      return res.status(400).json({ error: 'Nome e localização são obrigatórios.' });
    }

    const existingEstablishment = await estabelecimentoService.checkExistingEstablishment(nome, localizacao);
    if (existingEstablishment) {
      return res.status(400).json({ error: 'Já existe um estabelecimento com este nome ou localização.' });
    }

    let fotoUrl = null;

    if (req.file) {
      try {
        console.log('Processing establishment image');

        // Redimensiona a imagem e a salva no diretório correto
        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../../uploads/', filename);
        await sharp(resizedImage).toFile(filepath);
        console.log(`Saved resized image to ${filepath}`);

        // Remove o arquivo temporário
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error removing temporary file:', err);
          } else {
            console.log('Temporary file removed successfully');
          }
        });

        // URL pública da imagem
        fotoUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(400).json({ error: 'Erro ao processar a imagem.' });
      }
    } else {
      console.log('No file uploaded');
    }

    const establishment = await Estabelecimento.create({
      nome,
      localizacao,
      contacto,
      descricao,
      pago,
      precoMedio,
      linkLocalizacao,
      foto: fotoUrl,
      subareaId,
      centroId
    });

    res.status(201).json({ establishment });
  } catch (error) {
    console.error('Erro ao criar o estabelecimento:', error);
    next(error);
  }
};



// Controlador para buscar todos os estabelecimentos
const getAllEstablishments = async (req, res, next) => {
  try {
    const establishments = await estabelecimentoService.getAllEstablishments();
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar todos os estabelecimentos:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos por nome
const getEstablishmentsByName = async (req, res, next) => {
  const { nome } = req.query;
  try {
    const establishments = await estabelecimentoService.getEstablishmentsByName(nome);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por nome:', error);
    next(error);
  }
};

const getEstablishmentsByAreasAndCentro = async (req, res, next) => {
    const { areaIds, centroId } = req.query;

    try {
        if (!areaIds || typeof areaIds !== 'string' || areaIds.trim() === '') {
            throw new Error('IDs de área não fornecidos ou inválidos');
        }

        const areaIdsArray = areaIds.split(',').map(id => parseInt(id.trim(), 10));

        if (areaIdsArray.some(isNaN)) {
            throw new Error('IDs de área inválidos');
        }

        const establishments = await estabelecimentoService.getEstablishmentsByAreasAndCentro(areaIdsArray, centroId);

        res.json({ establishments });
    } catch (error) {
        console.error('Erro ao buscar estabelecimentos por áreas de interesse e centro:', error.message);
        next(error);
    }
};




// Controlador para buscar um estabelecimento pelo ID
const getEstablishmentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const establishment = await estabelecimentoService.getEstablishmentById(id);
    if (!establishment) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }
    res.json({ establishment });
  } catch (error) {
    console.error('Erro ao buscar estabelecimento por ID:', error);
    next(error);
  }
};


const activateEstablishment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const establishment = await Estabelecimento.findByPk(id);
    
    if (!establishment) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }

    if (establishment.ativo) {
      return res.status(400).json({ error: 'O estabelecimento já está ativo.' });
    }

    establishment.ativo = true;
    await establishment.save();

    res.json({ message: 'Estabelecimento ativado com sucesso!', establishment });
  } catch (error) {
    console.error('Erro ao ativar estabelecimento:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos por centro
const getEstablishmentsByCentro = async (req, res, next) => {
  const { centroId } = req.params; // Obtém o centroId dos parâmetros da URL
  try {
    const establishments = await estabelecimentoService.getEstablishmentsByCentro(centroId);
    if (establishments.length === 0) {
      return res.status(404).json({ error: 'Nenhum estabelecimento encontrado para este centro.' });
    }
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por centro:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos ativos por centro
const getActiveEstablishmentsByCentro = async (req, res, next) => {
  const { centroId } = req.params; // Obtém o centroId dos parâmetros da URL
  try {
    const establishments = await estabelecimentoService.getActiveEstablishmentsByCentro(centroId);
    if (establishments.length === 0) {
      return res.status(404).json({ error: 'Nenhum estabelecimento ativo encontrado para este centro.' });
    }
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos ativos por centro:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos inativos por centro
const getInactiveEstablishmentsByCentro = async (req, res, next) => {
  const { centroId } = req.params; // Obtém o centroId dos parâmetros da URL
  try {
    const establishments = await estabelecimentoService.getInactiveEstablishmentsByCentro(centroId);
    if (establishments.length === 0) {
      return res.status(404).json({ error: 'Nenhum estabelecimento inativo encontrado para este centro.' });
    }
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos inativos por centro:', error);
    next(error);
  }
};

const deleteEstablishment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const establishment = await Estabelecimento.findByPk(id);
    
    if (!establishment) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }

    await establishment.destroy();
    res.json({ message: 'Estabelecimento apagado com sucesso!' });
  } catch (error) {
    console.error('Erro ao apagar o estabelecimento:', error);
    next(error);
  }
};




const updateEstablishment = async (req, res, next) => {
  const { id } = req.params;
  const { nome, localizacao, contacto, descricao, pago, precoMedio, linkLocalizacao, subareaId, centroId } = req.body;

  try {
    const establishment = await Estabelecimento.findByPk(id);
    
    if (!establishment) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }

    let fotoUrl = establishment.foto; // Manter a foto atual caso não haja nova

    if (req.file) {
      try {
        console.log('Processing establishment image');

        // Redimensiona a imagem e a salva no diretório correto
        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../../uploads/', filename);
        await sharp(resizedImage).toFile(filepath);
        console.log(`Saved resized image to ${filepath}`);

        // Remove o arquivo temporário
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error removing temporary file:', err);
          } else {
            console.log('Temporary file removed successfully');
          }
        });

        // URL pública da imagem
        fotoUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(400).json({ error: 'Erro ao processar a imagem.' });
      }
    }

    // Atualiza os campos
    establishment.nome = nome || establishment.nome;
    establishment.localizacao = localizacao || establishment.localizacao;
    establishment.contacto = contacto || establishment.contacto;
    establishment.descricao = descricao || establishment.descricao;
    establishment.pago = pago !== undefined ? pago : establishment.pago;
    establishment.precoMedio = precoMedio || establishment.precoMedio;
    establishment.linkLocalizacao = linkLocalizacao || establishment.linkLocalizacao;
    establishment.subareaId = subareaId || establishment.subareaId;
    establishment.centroId = centroId || establishment.centroId;
    establishment.foto = fotoUrl; // Atualiza a URL da foto, se houver

    await establishment.save();
    res.json({ message: 'Estabelecimento atualizado com sucesso!', establishment });
  } catch (error) {
    console.error('Erro ao atualizar o estabelecimento:', error);
    next(error);
  }
};

const createActiveEstablishment = async (req, res, next) => {
  try {
    const { nome, localizacao, contacto, descricao, pago, precoMedio, linkLocalizacao, subareaId, centroId } = req.body;

    if (!nome || !localizacao) {
      return res.status(400).json({ error: 'Nome e localização são obrigatórios.' });
    }

    const existingEstablishment = await estabelecimentoService.checkExistingEstablishment(nome, localizacao);
    if (existingEstablishment) {
      return res.status(400).json({ error: 'Já existe um estabelecimento com este nome ou localização.' });
    }

    let fotoUrl = null;

    if (req.file) {
      try {
        console.log('Processing establishment image');

        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../../uploads/', filename);
        await sharp(resizedImage).toFile(filepath);
        console.log(`Saved resized image to ${filepath}`);

        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error removing temporary file:', err);
          }
        });

        fotoUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(400).json({ error: 'Erro ao processar a imagem.' });
      }
    }

    const establishment = await Estabelecimento.create({
      nome,
      localizacao,
      contacto,
      descricao,
      pago,
      precoMedio,
      linkLocalizacao,
      foto: fotoUrl,
      subareaId,
      centroId,
      ativo: true  // Criando o estabelecimento já como ativo
    });

    res.status(201).json({ establishment });
  } catch (error) {
    console.error('Erro ao criar estabelecimento ativo:', error);
    next(error);
  }
};


const countActiveAndInactiveEstablishments = async (req, res, next) => {
  try {
    const activeCount = await Estabelecimento.count({ where: { ativo: true } });
    const inactiveCount = await Estabelecimento.count({ where: { ativo: false } });

    res.json({ active: activeCount, inactive: inactiveCount });
  } catch (error) {
    console.error('Erro ao contar estabelecimentos ativos e inativos:', error);
    next(error);
  }
};




module.exports = {
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
  activateEstablishment,
  getEstablishmentsByCentro,
  getActiveEstablishmentsByCentro, 
  getInactiveEstablishmentsByCentro, 
    createActiveEstablishment,  
  deleteEstablishment,  
  updateEstablishment,
  countActiveAndInactiveEstablishments,
};
