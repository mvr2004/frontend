const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Função para criar um novo Admin
exports.createAdmin = async (req, res) => {
  try {
    const { nome, password, isMaster, centroId } = req.body;

    // Validar se o admin master está tentando criar um admin master

    const masterAdmin = await Admin.findOne({ where: { isMaster: true } });
    if (masterAdmin) {
      if (masterAdmin.isMaster && isMaster) {
        return res.status(403).json({ message: 'Admin master não pode criar outro admin master.' });
      }
    } else {
      // Se não há um Admin master, não permita a criação de qualquer admin
      return res.status(403).json({ message: 'Não há um Admin master registrado para criar novos admins.' });
    }

    // Criar o novo admin
    const newAdmin = await Admin.create({
      nome,
      password,
      isMaster: isMaster || false,
      centroId
    });

    res.status(201).json({ message: 'Admin criado com sucesso.', admin: newAdmin });
  } catch (error) {
    console.error('Erro ao criar Admin:', error);
    res.status(500).json({ message: 'Erro ao criar Admin.', error });
  }
};


exports.loginAdmin = async (req, res) => {
    const { nome, password } = req.body;

    try {
        // Procurar o admin pelo nome
        const admin = await Admin.findOne({ where: { nome } });

        if (!admin) {
            return res.status(401).json({ message: 'Nome ou palavra-passe inválidos.' });
        }

        // Comparar a senha
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Nome ou palavra-passe inválidos.' });
        }

        // Gerar o token JWT
		const token = jwt.sign(
			{ id: admin.id, nome: admin.nome, isMaster: admin.isMaster, role: admin.role }, // Adiciona role ao token
			'seu-segredo-jwt',
			{ expiresIn: '1h' }
		);


        res.status(200).json({
            token,
            idCentro: admin.centroId,
            nome: admin.nome
        });
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        res.status(500).json({ message: 'Erro ao tentar fazer login.' });
    }
};