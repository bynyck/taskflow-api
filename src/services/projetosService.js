import { ErroAplicacao } from "../errors/ErroAplicacao.js";
import { listarProjetosRepository, buscarProjetoPorIdRepository, cadastrarProjetoRepository , atualizarProjetoRepository, deletarProjetoRepository } from "../repositories/projetosRepository.js";
import { listarTarefasPorProjetoIdRepository } from "../repositories/tarefasRepository.js";

async function listarProjetosService() {
    const projetos = await listarProjetosRepository();

    if(projetos.length === 0) {
        return {
            sucesso: true,
            mensagem: "Nenhum projeto cadastrado",
            projetos
        }
    }

    return {
        sucesso: true,
        mensagem: "Projetos encontrados com sucesso",
        projetos
    }
}

async function buscarProjetoPorIdService(id) {

    const projeto = await buscarProjetoPorIdRepository(id);

    if(!projeto) {
        throw new ErroAplicacao("Projeto não encontrado", "PROJETO_NAO_ENCONTRADO",404);
    }

    return {
        sucesso: true,
        mensagem: "Projeto encontrado com sucesso",
        projeto
    }
}

async function listarTarefasPorProjetoService(id) {

    const projeto = await buscarProjetoPorIdRepository(id);

    if(!projeto) {
        throw new ErroAplicacao("Projeto não encontrado", "PROJETO_NAO_ENCONTRADO",404);
    }

    const tarefas = await listarTarefasPorProjetoIdRepository(id);

    return {
        sucesso: true,
        mensagem: "Tarefas do projeto encontradas com sucesso",
        projeto,
        tarefas
    }
}

async function cadastrarProjetoService(dados){

    const projeto = await cadastrarProjetoRepository(dados);

    return {
        sucesso: true,
        mensagem: "Projeto cadastrado com sucesso",
        projeto
    }
}

async function atualizarProjetoService(id, dados){

    const projetoEncontrado = await buscarProjetoPorIdRepository(id);

    if(!projetoEncontrado) {
        throw new ErroAplicacao("Projeto não encontrado","PROJETO_NAO_ENCONTRADO",404);
    }

    const projetoAtualizado = await atualizarProjetoRepository(projetoEncontrado.id, dados);

    return {
        sucesso: true,
        mensagem: "Projeto atualizado com sucesso",
        projeto: projetoAtualizado
    }
}

async function deletarProjetoService(id) {

    const projeto = await deletarProjetoRepository(id);

    if(!projeto) {
        throw new ErroAplicacao("Projeto não encontrado", "PROJETO_NAO_ENCONTRADO",404);
    }

    return {
        sucesso: true,
        mensagem: "Projeto deletado com sucesso",
        projeto
    }
}

export { listarProjetosService, buscarProjetoPorIdService, listarTarefasPorProjetoService, cadastrarProjetoService, atualizarProjetoService, deletarProjetoService };