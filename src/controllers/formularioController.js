const Formulario = require('../models/Formulario');
const CampoFormulario = require('../models/CampoFormulario');
const RespostaFormulario = require('../models/RespostaFormulario');
const Utilizador = require('../models/Utilizador');

// Criar formulário
exports.createFormulario = async (req, res) => {
    try {
        const { titulo, eventoId } = req.body;
        console.log('Dados recebidos:', { titulo, eventoId });

        const formulario = await Formulario.create({ nome: titulo, eventoId });  // Corrigido de 'titulo' para 'nome'
        res.status(201).json(formulario);
    } catch (error) {
        console.error('Erro ao criar formulário:', error);
        res.status(500).json({ error: 'Erro ao criar formulário' });
    }
};



// Atualizar estado do formulário
exports.updateFormularioStatus = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const { ativo } = req.body;
        const formulario = await Formulario.findByPk(formularioId);
        if (formulario) {
            formulario.ativo = ativo;
            await formulario.save();
            res.json({ message: 'Estado do formulário atualizado com sucesso' });
        } else {
            res.status(404).json({ error: 'Formulário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estado do formulário' });
    }
};

// Criar campo do formulário
exports.createCampoFormulario = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const formulario = await Formulario.findByPk(formularioId);

        if (!formulario) {
            return res.status(404).json({ error: 'Formulário não encontrado' });
        }

        if (formulario.publicado) {
            return res.status(403).json({ error: 'Não é possível editar campos de um formulário publicado' });
        }

        const { nome, tipo, opcoes } = req.body;
        const campoFormulario = await CampoFormulario.create({ nome, tipo, opcoes, formularioId });
        res.status(201).json(campoFormulario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar campo ao formulário' });
    }
};


// Submeter resposta ao formulário
exports.submitFormularioResponse = async (req, res) => {
    try {
        const { utilizadorId, respostas } = req.body; // respostas: [{ campoFormularioId: 1, resposta: 'resposta' }, ...]
        const responses = respostas.map(r => ({
            resposta: r.resposta,
            campoFormularioId: r.campoFormularioId,
            utilizadorId
        }));
        await RespostaFormulario.bulkCreate(responses);
        res.status(201).json({ message: 'Respostas submetidas com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao submeter respostas' });
    }
};

// Obter respostas por formulário
exports.getResponsesByFormulario = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const campos = await CampoFormulario.findAll({
            where: { formularioId },
            include: {
                model: RespostaFormulario,
                include: [Utilizador]
            }
        });
        res.json(campos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter respostas' });
    }
};

// Obter formulários respondidos por um utilizador
exports.getFormulariosRespondidos = async (req, res) => {
    try {
        const { utilizadorId } = req.params;
        const formulariosRespondidos = await RespostaFormulario.findAll({
            where: { utilizadorId },
            include: [{
                model: CampoFormulario,
                include: [Formulario]
            }]
        });
        const formularios = formulariosRespondidos.map(resposta => resposta.CampoFormulario.Formulario);
        res.json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter formulários respondidos' });
    }
};

// Obter respostas de um formulário por utilizador e evento
exports.getFormularioResponsesByUserAndEvent = async (req, res) => {
    try {
        const { utilizadorId, eventoId, formularioId } = req.params;
        const campos = await CampoFormulario.findAll({
            where: { formularioId },
            include: {
                model: RespostaFormulario,
                where: { utilizadorId },
                include: [Utilizador]
            }
        });
        const formulario = await Formulario.findOne({ where: { id: formularioId, eventoId } });
        if (formulario) {
            res.json({ formulario, campos });
        } else {
            res.status(404).json({ error: 'Formulário não encontrado para este evento' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter respostas' });
    }
};

// Obter formulários respondidos de um evento por um utilizador
exports.getFormulariosRespondidosPorEvento = async (req, res) => {
    try {
        const { utilizadorId, eventoId } = req.params;
        const formulariosRespondidos = await RespostaFormulario.findAll({
            where: { utilizadorId },
            include: [{
                model: CampoFormulario,
                include: [{
                    model: Formulario,
                    where: { eventoId }
                }]
            }]
        });
        const formularios = formulariosRespondidos.map(resposta => resposta.CampoFormulario.Formulario);
        res.json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter formulários respondidos para o evento' });
    }
};

// Obter formulários de um evento
exports.getFormulariosByEvento = async (req, res) => {
    try {
        const { eventoId } = req.params;
        const formularios = await Formulario.findAll({
            where: { eventoId, ativo: true },
            include: [{
                model: CampoFormulario,
                required: true,
            }]
        });
        res.json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter formulários para o evento' });
    }
};


// Publicar formulário
exports.publishFormulario = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const formulario = await Formulario.findByPk(formularioId);

        if (!formulario) {
            return res.status(404).json({ error: 'Formulário não encontrado' });
        }

        formulario.publicado = true;
        await formulario.save();
        res.json({ message: 'Formulário publicado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao publicar formulário' });
    }
};


// Atualizar campo do formulário
exports.updateCampoFormulario = async (req, res) => {
    try {
        const { campoFormularioId } = req.params;
        const { nome, tipo, opcoes } = req.body;

        const campoFormulario = await CampoFormulario.findByPk(campoFormularioId);

        if (!campoFormulario) {
            return res.status(404).json({ error: 'Campo de formulário não encontrado' });
        }

        // Atualiza os campos
        campoFormulario.nome = nome || campoFormulario.nome;
        campoFormulario.tipo = tipo || campoFormulario.tipo;
        campoFormulario.opcoes = opcoes || campoFormulario.opcoes;
        
        await campoFormulario.save();
        res.json(campoFormulario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar campo do formulário' });
    }
};



// Obter todos os campos de um formulário
exports.getCamposByFormulario = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const campos = await CampoFormulario.findAll({ where: { formularioId } });
        
        if (campos.length === 0) {
            return res.status(404).json({ error: 'Nenhum campo encontrado para este formulário' });
        }

        res.json(campos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter campos do formulário' });
    }
};
