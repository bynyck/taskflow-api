import { listarProjetosService, buscarProjetoPorIdService, listarTarefasPorProjetoService, cadastrarProjetoService, atualizarProjetoService, deletarProjetoService } from "../services/projetosService.js"

async function listarProjetosController(req,res) {

    const resposta = await listarProjetosService();

    return res.status(200).json(resposta);
}

async function buscarProjetoPorIdController(req,res) {
    const { id } = req.dadosValidados;
    
    const resposta = await buscarProjetoPorIdService(id);

    return res.status(200).json(resposta);
}

async function listarTarefasPorProjetoController(req,res) {
    const { id } = req.dadosValidados;

    const resposta = await listarTarefasPorProjetoService(id);

    return res.status(200).json(resposta);
}

async function cadastrarProjetoController(req,res) {
    const dados = req.body;

    const resposta = await cadastrarProjetoService(dados);

    return res.status(201).json(resposta);
}

async function atualizarProjetoController(req,res) {
    const { id } = req.dadosValidados;

    const dados = req.body;

    const resposta = await atualizarProjetoService(id, dados);

    return res.status(200).json(resposta);
}

async function deletarProjetoController(req,res) {
    const { id } = req.dadosValidados;

    const resposta = await deletarProjetoService(id);

    return res.status(200).json(resposta);
}

export { listarProjetosController, buscarProjetoPorIdController, listarTarefasPorProjetoController, cadastrarProjetoController, atualizarProjetoController, deletarProjetoController };