import { test, expect, describe } from "vitest";
import { cadastrarTarefaSchema, atualizarTarefaSchema } from "../src/schemas/tarefasSchemas.js";

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
