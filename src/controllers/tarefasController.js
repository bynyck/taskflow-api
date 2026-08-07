import { listarTarefasService, buscarTarefaPorIdService, cadastrarTarefaService, atualizarTarefaService, concluirTarefaService, reabrirTarefaService, deletarTarefaService } from "../services/tarefasService.js";

async function listarTarefasController(req, res) {
    
    const filtros = req.dadosValidados;

    const resposta = await listarTarefasService(filtros);

    return res.status(200).json(resposta);
} 

async function buscarTarefaPorIdController(req, res) {
    const id = Number(req.params.id);

    const resposta = await buscarTarefaPorIdService(id);

    return res.status(200).json(resposta);
}

async function cadastrarTarefaController(req, res) {
    const dados = req.body;

    const resposta = await cadastrarTarefaService(dados);

    return res.status(201).json(resposta);
}

async function atualizarTarefaController(req, res) {
    const id = Number(req.params.id);
    const dados = req.body;

    const resposta = await atualizarTarefaService(id, dados);

    return res.status(200).json(resposta);
}

async function concluirTarefaController(req, res) {
    const id = Number(req.params.id);
    
    const resposta = await concluirTarefaService(id);

    return res.status(200).json(resposta);
}

async function reabrirTarefaController(req, res) {
    const id = Number(req.params.id);

    const resposta = await reabrirTarefaService(id);

    return res.status(200).json(resposta);
}

async function deletarTarefaController(req, res) {
    const id = Number(req.params.id);

    const resposta = await deletarTarefaService(id);

    return res.status(200).json(resposta);
}

export {
    listarTarefasController,
    buscarTarefaPorIdController,
    cadastrarTarefaController,
    atualizarTarefaController,
    concluirTarefaController,
    reabrirTarefaController,
    deletarTarefaController
}