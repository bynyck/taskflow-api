import { ErroAplicacao } from "../errors/ErroAplicacao.js";

function validarRequisicao(schema, origem = "body") {
  return (request, response, next) => {
    const resultado = schema.safeParse(request[origem]);

    if (!resultado.success) {
      const errosFormatados = resultado.error.issues.map((erro) => {
        return {
          campo: erro.path.join("."),
          mensagem: erro.message
        };
      });

      const erroValidacao = new ErroAplicacao(
        "Os dados enviados são inválidos",
        "DADOS_INVALIDOS",
        400,
        errosFormatados
      );

      return next(erroValidacao);
    }

    if (origem === "body") {
      request.body = resultado.data;
    }else{
      request.dadosValidados = resultado.data;
    }

    next();
  };
}


export { validarRequisicao };