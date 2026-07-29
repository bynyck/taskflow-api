import { ErroAplicacao } from "../errors/ErroAplicacao.js";

function tratarErros(erro, request, response, next) {

    if(erro instanceof ErroAplicacao) {
        return response.status(erro.statusCode).json({
            sucesso: false,
            tipoErro: erro.tipoErro,
            mensagem: erro.message,
            detalhes: erro.detalhes
        })
    }

    console.error("Erro não tratado:", erro)

    return response.status(500).json({
        sucesso: false,
        tipoErro: "ERRO_INTERNO",
        mensagem: "Erro interno no servidor"
    });
}

export { tratarErros };