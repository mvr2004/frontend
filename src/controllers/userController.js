const bcrypt = require('bcrypt');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const User = require('../models/Utilizador');     
const Evento = require('../models/Evento');
const Estabelecimento = require('../models/Estabelecimento');                                                         
const Centro = require('../models/Centro');
const UserArea = require('../models/UtilizadorArea');
const Area = require('../models/Area');
const { queryTable, registerUser, confirmEmail, updateUserPassword, updateUserCentro, verifyPassword } = require('../services/userService');
const { sendConfirmationEmail,sendResetEmail , sendNewPasswordEmail } = require('../services/emailService');
const upload = require('../configs/multer'); 
const { Op } = require('sequelize');


exports.register = async (req, res) => {
  const { nome, email, password, fotoUrl } = req.body;
  try {
    const result = await registerUser(nome, email, password, fotoUrl);
    if (result.success === false && result.reason === 'user_exists') {
      return res.status(400).json({ message: 'Utilizador já existe' });
    }

    if (result.success) {
      res.status(201).json({ message: 'Utilizador registrado com sucesso. Verifique seu e-mail para confirmar.' });
    } else {
      res.status(400).json({ message: 'Falha ao registrar utilizador' });
    }
  } catch (err) {
    console.error('Erro ao registrar utilizador:', err);
    res.status(500).json({ message: `Erro ao registrar utilizador: ${err.message}` });
  }
};

exports.getData = async (req, res) => {
  try {
    const data = await queryTable();
    res.json(data);
  } catch (err) {
    console.error('Erro ao obter dados da tabela:', err);
    res.status(500).json({ message: `Erro ao obter dados da tabela: ${err.message}` });
  }
};

exports.confirmEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const success = await confirmEmail(email, code);
    if (success) {
      res.status(200).json({ message: 'E-mail confirmado com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao confirmar e-mail' });
    }
  } catch (err) {
    console.error('Erro ao confirmar e-mail:', err);
    res.status(500).json({ message: `Erro ao confirmar e-mail: ${err.message}` });
  }
};

exports.updatePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Verificar a senha atual antes de atualizar
    await verifyPassword(userId, currentPassword);

    // Atualizar a senha
    const success = await updateUserPassword(userId, newPassword);

    if (success) {
      res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao atualizar a senha' });
    }
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    res.status(500).json({ message: `Erro ao atualizar a senha: ${error.message}` });
  }
};


exports.updateCentro = async (req, res) => {
  const { userId, centroId } = req.body;
  console.log(`Recebido userId: ${userId}, centroId: ${centroId}`);
  try {
    const success = await updateUserCentro(userId, centroId);
    if (success) {
      res.status(200).json({ message: 'Centro atualizado com sucesso' });
    } else {
      res.status(400).json({ message: 'Falha ao atualizar centro' });
    }
  } catch (err) {
    console.error('Erro ao atualizar centro:', err);
    res.status(500).json({ message: `Erro ao atualizar centro: ${err.message}` });
  }
};

exports.getUserData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      include: Centro // Se quiser incluir dados do centro associado ao usuário
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (err) {
    console.error(`Erro ao buscar dados do usuário: ${err.message}`);
    res.status(500).json({ message: `Erro ao buscar dados do usuário: ${err.message}` });
  }
};


// Função para gerar um código de 5 dígitos
const generateConfirmationCode = () => {
  return Math.floor(10000 + Math.random() * 90000); // Gera um número aleatório entre 10000 e 99999
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log(`Procurando usuário com email: ${email}`);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`Usuário não encontrado para email: ${email}`);
      return res.status(404).json({ message: 'Email não encontrado' });
    }

    console.log(`Usuário encontrado: ${user.email}`);

    const resetCode = generateConfirmationCode();
    console.log(`Código de confirmação gerado: ${resetCode}`);

    user.confirmationCode = resetCode;
    await user.save();

    console.log(`Código de confirmação salvo para usuário: ${user.email}`);

    await sendResetEmail(email, resetCode);
    console.log(`Email enviado com código de confirmação para: ${email}`);

    res.status(200).json({ message: 'Código de confirmação enviado para o email' });
  } catch (err) {
    console.error('Erro ao processar solicitação de esqueci a senha:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação de esqueci a senha' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, code } = req.body;

  try {
    console.log(`Tentando redefinir senha para o email: ${email} com código: ${code}`);

    // Encontrar o usuário com o email e código de confirmação fornecidos
    const user = await User.findOne({ where: { email, confirmationCode: code } });
    if (!user) {
      console.log(`Código de confirmação inválido para o email: ${email}`);
      return res.status(400).json({ message: 'Código de confirmação inválido' });
    }

    // Gerar nova senha aleatória
    const newPassword = Math.random().toString(36).slice(-8); // Gera uma senha aleatória
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha do usuário
    user.password = hashedPassword;
    user.firstLogin = true; // Marca o usuário como primeiro login
    user.confirmationCode = null; // Limpa o código de confirmação
    await user.save();

    console.log(`Senha redefinida com sucesso para o email: ${email}`);

    // Enviar nova senha por email
    await sendNewPasswordEmail(email, newPassword);

    // Responder ao cliente com sucesso
    res.status(200).json({ message: 'Senha redefinida e enviada por email' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
};

exports.updateUserProfile = async (req, res) => {
    try {
        console.log('Request received to update user profile');

        const user = await User.findByPk(req.params.id);
        if (!user) {
            console.log(`User with ID ${req.params.id} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.nome) {
            console.log(`Updating user name to ${req.body.nome}`);
            user.nome = req.body.nome;
        }

        if (req.file) {
            console.log('Received file:', req.file);
            console.log('File path:', req.file.path);

            try {
                console.log('Processing profile image');

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
                    } else {
                        console.log('Temporary file removed successfully');
                    }
                });

                user.fotoUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;
            } catch (imageError) {
                console.error('Error processing image:', imageError);
                return res.status(400).json({ error: 'Invalid image input' });
            }
        } else {
            console.log('No file uploaded');
        }

        await user.save();
        console.log('User profile updated successfully');

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'An error occurred while updating the profile' });
    }
};







exports.getUserAreas = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Area,
        through: { attributes: [] } // Isso garante que apenas os dados de `Area` sejam incluídos
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ areas: user.Areas });
  } catch (err) {
    console.error(`Erro ao buscar áreas do usuário: ${err.message}`);
    res.status(500).json({ message: `Erro ao buscar áreas do usuário: ${err.message}` });
  }
};


exports.updateUserAreas = async (req, res) => {
  const { userId, areaIds } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza as associações do usuário com as áreas fornecidas
    await user.setAreas(areaIds);

    res.status(200).json({ message: 'Áreas de interesse atualizadas com sucesso' });
  } catch (err) {
    console.error(`Erro ao atualizar áreas de interesse do usuário: ${err.message}`);
    res.status(500).json({ message: `Erro ao atualizar áreas de interesse do usuário: ${err.message}` });
  }
};

exports.listarEventosEEstabelecimentos = async (req, res) => {
    const utilizadorId = req.params.userId;

    try {
        // Use 'User' instead of 'Utilizador'
        const utilizador = await User.findOne({
            where: { id: utilizadorId },
            include: {
                model: Centro, // Include the associated Centro
                attributes: ['id', 'centro'],
            },
        });

        if (!utilizador) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }

        const centroId = utilizador.centroId; // ID do centro associado ao utilizador

        // Buscar áreas de interesse para o utilizador
        const areasDeInteresse = await Area.findAll({
            include: {
                model: User, // Use 'User' here as well
                where: { id: utilizadorId },
                through: { attributes: [] },
            },
        });

        // Extrair IDs das áreas de interesse
        const areaIds = areasDeInteresse.map((area) => area.id);

        if (areaIds.length === 0) {
            return res.status(200).json({
                message: 'Nenhuma área de interesse encontrada para o utilizador',
                eventos: [],
                estabelecimentos: [],
            });
        }

        // Buscar eventos nas áreas de interesse do utilizador e do centro associado
        const eventos = await Evento.findAll({
            where: {
                subareaId: {
                    [Op.in]: areaIds,
                },
                publicado: true,
                centroId: centroId, // Adiciona a filtragem por centro
            },
            order: [
                ['data', 'ASC'],
                ['hora', 'ASC'],
            ],
        });

        // Buscar estabelecimentos nas áreas de interesse do utilizador e do centro associado
        const estabelecimentos = await Estabelecimento.findAll({
            where: {
                subareaId: {
                    [Op.in]: areaIds,
                },
                ativo: true,
                centroId: centroId, // Adiciona a filtragem por centro
            },
            order: [['id', 'DESC']],
        });

        res.status(200).json({
            eventos,
            estabelecimentos,
        });

    } catch (error) {
        console.error('Erro ao listar eventos e estabelecimentos:', error);
        res.status(500).json({ message: 'Erro ao listar eventos e estabelecimentos', error: error.message });
    }
};
