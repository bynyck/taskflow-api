import { test, expect, describe } from "vitest";
import { cadastrarTarefaSchema, atualizarTarefaSchema, listarTarefasQuerySchema } from "../src/schemas/tarefasSchemas.js";

describe("cadastrarTarefaSchema", () => {
    test("deve rejeitar um título vazio", () => {
        const dados = {
            titulo: "",
            prioridade: "alta"
        }

        const resultado = cadastrarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    });

    test("deve aceitar dados válidos", () => {
        const dados = {
            titulo: "Estuda testes automaticos",
            prioridade: "alta"
        }

        const resultado = cadastrarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(true);
    });

    test("deve normalizar a prioridade", () => {
        const dados = { 
            titulo: "Estudar testes", 
            prioridade: "  ALTA  "
        }

        const resultado = cadastrarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(true);

        if(resultado.success) {
            expect(resultado.data.prioridade).toBe("alta");
        }

    });


    test("deve rejeitar uma prioridade inválida", () => {
        const dados = {
            titulo: "Revisar PR",
            prioridade: "urgente"
        }

        const resultado = cadastrarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    });

    test("deve informar que um título é obrigatório", () => {
        const dados = {
            titulo: "",
            prioridade: "alta"
        }

        const resultado = cadastrarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(false);

        if(!resultado.success) {
            const erro = resultado.error.issues[0];

            expect(erro.message).toBe("Titulo é obrigatório");
        }
    });

    test("deve aceitar uma tarefa válida contendo projetoId", () => {
        const dados = {
            titulo: "Aprender notion",
            prioridade: "alta",
            projetoId: 1
        }

        const resultado = cadastrarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(true);
    })
})

describe("atualizarTarefaSchema", () => {
    test("deve rejeitar uma atualização sem campos", () => {
        const dados = {};

        const resultado = atualizarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    })

    test("deve aceitar uma atualização parcial", () => {
        const dados = {
            prioridade: "alta"
        };

        const resultado = atualizarTarefaSchema.safeParse(dados);

        expect(resultado.success).toBe(true);
    })
})

describe("listarTarefasQuerySchema", () => {
    test("deve rejeitar limite maior que 100", () => {
        const dados = {
            limite: "101"
        };

        const resultado = listarTarefasQuerySchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    })

    test("deve aceitar limite máxmimo de 100", () => {
        const dados = {
            limite: "100"
        }

        const resultado = listarTarefasQuerySchema.safeParse(dados);

        expect(resultado.success).toBe(true);

        if(resultado.success) {
            expect(resultado.data.limite).toBe(100);
        }
    })

    test("deve aceitar os valores padrao", () => {
        const dados = {};

        const resultado = listarTarefasQuerySchema.safeParse(dados);

        expect(resultado.success).toBe(true);

        if(resultado.success) {
            expect(resultado.data.pagina).toBe(1);

            expect(resultado.data.limite).toBe(10);
        }
    })
})
