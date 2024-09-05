const Album = require('../models/Album');
const Foto = require('../models/Fotos');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const Utilizador = require('../models/Utilizador');




exports.createAlbum = async (req, res) => {
  try {
    const { titulo, descricao, forumId } = req.body;

    // Verifica se o forumId foi passado
    if (!forumId) {
      return res.status(400).json({ error: 'ForumId é obrigatório.' });
    }

    const album = await Album.create({ titulo, descricao, forumId });
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar álbum.' });
  }
};

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar álbuns.' });
  }
};

// Método para buscar álbuns por fórum
exports.getAlbumsByForum = async (req, res) => {
  try {
    const { forumId } = req.params;
    const albums = await Album.findAll({ where: { forumId } });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar álbuns por fórum.' });
  }
};

// Método para upload de fotos
exports.uploadPhotos = async (req, res) => {
    try {
        const { albumId } = req.params;
        const { userId } = req.body;

        const album = await Album.findByPk(albumId);

        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        // Verifica se o userId existe na tabela Utilizadors
        const userExists = await Utilizador.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        const photoPromises = req.files.map(async (file) => {
            const resizedImageBuffer = await sharp(file.path)
                .resize({ width: 800, height: 800 })
                .toBuffer();

            const filename = `${Date.now()}-${file.originalname}`;
            const filepath = path.join(__dirname, '../../uploads/', filename);
            await sharp(resizedImageBuffer).toFile(filepath);

            // Remover o arquivo temporário
            fs.unlink(file.path, (err) => {
                if (err) console.error('Erro ao remover arquivo temporário:', err);
            });

            // Criar e salvar a foto no banco de dados, associando-a ao album e ao utilizador
            return Foto.create({
                url: `https://backend-9hij.onrender.com/uploads/${filename}`,
                descricao: req.body.descricao || null,
                albumId: album.id,
                userId: userId,
                createdAt: new Date()
            });
        });

        const photos = await Promise.all(photoPromises);

        res.status(201).json({ message: 'Fotos enviadas com sucesso', photos });
    } catch (error) {
        console.error('Erro ao enviar fotos:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao enviar as fotos' });
    }
};


// Método para buscar fotos por álbum
exports.getPhotosByAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findByPk(albumId, {
      include: {
        model: Foto,
        include: {
          model: Utilizador,
          attributes: ['id', 'nome', 'email']
        }
      }
    });

    if (!album) {
      return res.status(404).json({ error: 'Álbum não encontrado.' });
    }

    res.json(album.Fotos); // Retorna as fotos associadas ao álbum
  } catch (error) {
    console.error('Erro ao buscar fotos por álbum:', error);
    res.status(500).json({ error: 'Erro ao buscar fotos por álbum.' });
  }
};