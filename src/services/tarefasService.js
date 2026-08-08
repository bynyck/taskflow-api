import { listarTarefasRepository, contarTarefasRepository, buscarTarefaPorIdRepository, cadastrarTarefaRepository, concluirTarefaRepository, deletarTarefaRepository, reabrirTarefaRepository, atualizarTarefaRepository } from "../repositories/tarefasRepository.js";
import { ErroAplicacao } from "../errors/ErroAplicacao.js";
import { buscarProjetoPorIdRepository } from "../repositories/projetosRepository.js";

async function listarTarefasService(filtros) {

    const { pagina, limite } = filtros;

    const offset = (pagina - 1) * limite;

    const filtrosPaginados = {
        ...filtros,
        offset
    };

    const tarefas = await listarTarefasRepository(filtrosPaginados);

    const total = await contarTarefasRepository(filtros);

    const totalPaginas = Math.ceil(total / limite);

    if(tarefas.length === 0) {
        return {
            sucesso: true,
            mensagem: "Nenhuma tarefa encontrada",
            pagina,
            limite,
            total,
            totalPaginas,
            tarefas
        }
    }

    return {
        sucesso: true,
        mensagem: "Tarefas encontradas com sucesso",
        pagina,
        limite,
        total,
        totalPaginas,
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
    const { projetoId } = dados;

    if(projetoId !== undefined) {
        const projeto = await buscarProjetoPorIdRepository(projetoId);

        if(!projeto) {
            throw new ErroAplicacao("Projeto não encontrado","PROJETO_NAO_ENCONTRADO",404);
        }
    }

    const tarefa = await cadastrarTarefaRepository(dados);

    const tarefaEncontrada = await buscarTarefaPorIdRepository(tarefa.id)

    return {
        sucesso: true,
        mensagem: "Tarefa criada com sucesso",
        tarefa: tarefaEncontrada
    }

}

async function atualizarTarefaService(id, dados) {
    if(!Number.isInteger(id) || id <= 0) {
        throw new ErroAplicacao("Id inválido", "DADOS_INVALIDOS", 400);
    }

    const {projetoId} = dados;

    if(typeof projetoId === "number") {
        const projeto = await buscarProjetoPorIdRepository(projetoId);

        if(!projeto){
            throw new ErroAplicacao("Projeto não encontrado","PROJETO_NAO_ENCONTRADO",404);
        }
    }

    const tarefa = await atualizarTarefaRepository(id, dados);

    if(!tarefa) {
        throw new ErroAplicacao("Tarefa não encontrada", "TAREFA_NAO_ENCONTRADA",404);
    }

    const tarefaEncontrada = await buscarTarefaPorIdRepository(tarefa.id);

    return {
        sucesso: true,
        mensagem: "Tarefa atualizada com sucesso",
        tarefa: tarefaEncontrada
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