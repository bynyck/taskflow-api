import { listarTarefasRepository, buscarTarefaPorIdRepository, cadastrarTarefaRepository, concluirTarefaRepository, deletarTarefaRepository, reabrirTarefaRepository, atualizarTarefaRepository } from "../repositories/tarefasRepository.js";
import { ErroAplicacao } from "../errors/ErroAplicacao.js";

async function listarTarefasService() {
    const tarefas = await listarTarefasRepository();

    if(tarefas.length === 0) {
        return {
            sucesso: true,
            mensagem: "Nenhuma tarefa cadastrada",
            tarefas
        }
    }

    return {
        sucesso: true,
        mensagem: "Tarefas encontradas com sucesso",
        tarefas
    }
}

async function buscarTarefaPorIdService(id) {
    if(!Number.isInteger(id) || id <= 0) {
        throw new ErroAplicacao("Id inválido", "DADOS_INVALIDOS", 400);
    }

    const tarefa = await buscarTarefaPorIdRepository(id);

    if(!tarefa) {
        throw new ErroAplicacao("Tarefa não encontrada", "TAREFA_NAO_ENCONTRADA", 404);
    }

    return {
        sucesso: true,
        mensagem: "Tarefa encontrada com sucesso",
        tarefa
    }
}

async function cadastrarTarefaService(dados) {

    const tarefa = await cadastrarTarefaRepository(dados);

    return {
        sucesso: true,
        mensagem: "Tarefa criada com sucesso",
        tarefa
    }

}

async function atualizarTarefaService(id, dados) {
    if(!Number.isInteger(id) || id <= 0) {
        throw new ErroAplicacao("Id inválido", "DADOS_INVALIDOS", 400);
    }

    const tarefa = await atualizarTarefaRepository(id, dados);

    if(!tarefa) {
        throw new ErroAplicacao("Tarefa não encontrada", "TAREFA_NAO_ENCONTRADA",404);
    }

    return {
        sucesso: true,
        mensagem: "Tarefa atualizada com sucesso",
        tarefa
    }
}

async function concluirTarefaService(id) {
    if(!Number.isInteger(id) || id <= 0) {
        throw new ErroAplicacao("Id inválido", "DADOS_INVALIDOS", 400);
    }

    const tarefa = await buscarTarefaPorIdRepository(id);

    if(!tarefa) {
        throw new ErroAplicacao("Tarefa não encontrada", "TAREFA_NAO_ENCONTRADA",404);
    }

    if(tarefa.concluida) {
        throw new ErroAplicacao("Tarefa já está concluida", "TAREFA_JA_CONCLUIDA", 409);
    }

    const tarefaConcluida = await concluirTarefaRepository(tarefa.id);


    return {
        sucesso: true,
        mensagem: "Tarefa concluída com sucesso",
        tarefa: tarefaConcluida
    }
}

async function reabrirTarefaService(id) {
    if(!Number.isInteger(id) || id <= 0) {
        throw new ErroAplicacao("Id inválido", "DADOS_INVALIDOS", 400);
    }

    const tarefa = await buscarTarefaPorIdRepository(id);

    if(!tarefa) {
        throw new ErroAplicacao("Tarefa não encontrada", "TAREFA_NAO_ENCONTRADA", 404);
    }

    if(!tarefa.concluida) {
        throw new ErroAplicacao("Tarefa já está aberta", "TAREFA_JA_ABERTA", 409);
    }

    const tarefaReaberta = await reabrirTarefaRepository(tarefa.id);

    return {
        sucesso: true,
        mensagem: "Tarefa aberta com sucesso",
        tarefa: tarefaReaberta
    }

}

async function deletarTarefaService(id) {
    if(!Number.isInteger(id) || id <= 0) {
        throw new ErroAplicacao("Id inválido", "DADOS_INVALIDOS", 400);
    }

    const tarefaDeletada = await deletarTarefaRepository(id);

    if(!tarefaDeletada) {
        throw new ErroAplicacao("Tarefa não encontrada", "TAREFA_NAO_ENCONTRADA", 404);
    }

    return {
        sucesso: true,
        mensagem: "Tarefa deletada com sucesso",
        tarefaRemovida: tarefaDeletada
    }
}

export {
    listarTarefasService,
    buscarTarefaPorIdService,
    cadastrarTarefaService,
    atualizarTarefaService,
    concluirTarefaService,
    reabrirTarefaService,
    deletarTarefaService
}