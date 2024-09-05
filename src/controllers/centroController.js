const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Centro = require('../models/Centro');
const Admin = require('../models/Admin');

// Função para desativar um centro
const desativarCentro = async (req, res) => {
    const { id } = req.params;
    try {
        const centro = await Centro.findByPk(id);
        if (!centro) {
            return res.status(404).json({ message: 'Centro não encontrado' });
        }
        centro.ativo = false;
        await centro.save();
        res.json({ message: 'Centro desativado com sucesso', centro });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar centro', error });
    }
};

// Função para listar todos os distritos disponíveis
const listarDistritos = (req, res) => {
    const distritosDir = path.join(__dirname, '../../uploads/distritos');
    fs.readdir(distritosDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao listar distritos', error: err });
        }

        const distritos = files.map(file => {
            const name = file.replace('portugal_distritos_', '').replace('.png', '').replace(/-/g, ' ');
            return {
                name: name.charAt(0).toUpperCase() + name.slice(1),
                imageUrl: `https://backend-9hij.onrender.com/uploads/distritos/${file}`
            };
        });

        res.json(distritos);
    });
};

const criarCentro = async (req, res) => {
    const { centro, distrito, adminNome, adminPassword } = req.body;
    const defaultPassword = adminPassword || '123'; // Senha padrão

    const districtFileName = `portugal_distritos_${distrito.toLowerCase().replace(/\s/g, '-')}.png`;
    const imagePath = path.join(__dirname, '../../uploads/distritos', districtFileName);

    try {
        console.log(`Verificando imagem em: ${imagePath}`);
        if (fs.existsSync(imagePath)) {
            // Verificar se o centro já existe
            const existingCentro = await Centro.findOne({ where: { centro } });
            if (existingCentro) {
                return res.status(400).json({ message: 'Centro já existe com o nome fornecido' });
            }

            // Criar o novo centro
            console.log(`Criando centro: ${centro}`);
            const newCentro = await Centro.create({
                centro,
                fotos: `https://backend-9hij.onrender.com/uploads/distritos/${districtFileName}`
            });

            console.log(`Centro criado com sucesso: ${JSON.stringify(newCentro)}`);

            // Criar o novo administrador associado ao centro
            console.log(`Criando administrador para o centro: ${newCentro.id}`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultPassword, salt);

            const newAdmin = await Admin.create({
                nome: adminNome || `Admin ${centro}`,
                password: hashedPassword,
                centroId: newCentro.id
            });

            console.log(`Administrador criado com sucesso: ${JSON.stringify(newAdmin)}`);

            res.status(201).json({
                message: 'Centro e admin criados com sucesso',
                centro: newCentro,
                admin: newAdmin
            });
        } else {
            console.error('Imagem correspondente ao distrito não encontrada');
            res.status(404).json({ message: 'Imagem correspondente ao distrito não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao criar centro:', error);
        res.status(500).json({ message: 'Erro ao criar centro', error });
    }
};

// Função para listar todos os centros com paginação e ordenação alfabética
const listarCentros = async (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Página atual e limite por página
    const offset = (page - 1) * limit;

    try {
        const { rows: centros, count: totalCentros } = await Centro.findAndCountAll({
            offset: offset,
            limit: parseInt(limit),
            order: [['centro', 'ASC']], // Ordena os centros pelo nome em ordem alfabética
        });

        res.json({
            centros,
            totalCentros,
            totalPages: Math.ceil(totalCentros / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar centros', error });
    }
};

// Função para listar todos os distritos disponíveis (parece que há uma confusão com a nomenclatura)
// Função para listar todos os centros
const listarCentros1 = async (req, res) => {
    try {
        const centros = await Centro.findAll();
        res.json(centros);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar centros', error });
    }
};

const toggleCentroStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const centro = await Centro.findByPk(id);
        if (!centro) {
            return res.status(404).json({ message: 'Centro não encontrado' });
        }
        centro.ativo = !centro.ativo;  // Alterna entre ativo e inativo
        await centro.save();
        res.json({
            message: `Centro ${centro.ativo ? 'ativado' : 'desativado'} com sucesso`,
            centro
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao alterar o status do centro', error });
    }
};

// Função para editar um centro e seu admin associado
const editarCentro = async (req, res) => {
    const { id } = req.params; // ID do centro a ser editado
    const { novoCentro, novoDistrito, novoAdminNome, novaPalavraPasse } = req.body;

    try {
        // Buscar o centro pelo ID
        const centro = await Centro.findByPk(id);
        if (!centro) {
            return res.status(404).json({ message: 'Centro não encontrado' });
        }

        let updatedCentro = false;

        // Atualizar o nome do centro se fornecido
        if (novoCentro) {
            centro.centro = novoCentro;
            updatedCentro = true;
        }

        // Atualizar o distrito se fornecido
        if (novoDistrito) {
            const districtFileName = `portugal_distritos_${novoDistrito.toLowerCase().replace(/\s/g, '-')}.png`;
            const imagePath = path.join(__dirname, '../../uploads/distritos', districtFileName);

            if (fs.existsSync(imagePath)) {
                centro.fotos = `https://backend-9hij.onrender.com/uploads/distritos/${districtFileName}`;
            } else {
                return res.status(404).json({ message: 'Imagem correspondente ao novo distrito não encontrada' });
            }
        }

        if (updatedCentro) {
            await centro.save();
        }

        // Buscar o administrador associado ao centro
        const admin = await Admin.findOne({ where: { centroId: centro.id } });
        if (admin) {
            // Atualizar o nome do administrador se fornecido ou se o nome do centro foi atualizado
            if (novoAdminNome) {
                admin.nome = novoAdminNome;
            } else if (updatedCentro) {
                admin.nome = `Admin ${centro.centro}`;
            }

            // Atualizar a senha do administrador somente se fornecida
            if (novaPalavraPasse) {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(novaPalavraPasse, salt);
            }

            await admin.save();
        }

        res.json({ message: 'Centro e Admin atualizados com sucesso', centro, admin });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar centro', error });
    }
};

module.exports = {
    listarCentros,
    listarCentros1,
    criarCentro,
    listarDistritos,
    toggleCentroStatus,
    editarCentro  
};
