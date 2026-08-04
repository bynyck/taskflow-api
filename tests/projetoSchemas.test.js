import { test, describe, expect } from "vitest";
import { atualizarProjetoSchema, cadastrarProjetoSchema } from "../src/schemas/projetosSchemas";

describe("CadastrarProjetoSchame", () => {
    test("Deve aceitar dados válidos", () => {
        const dados = {
            nome: "Portfólio",
            descricao: "Projetos para apresentar em processos seletivos"
        }

        const resultado = cadastrarProjetoSchema.safeParse(dados);

        expect(resultado.success).toBe(true)
    })

    test("Deve rejeitar um nome vazio", () => {
        const dados = {
            nome: "",
            descricao: "Teste do vitest"
        }

        const resultado = cadastrarProjetoSchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    })

    test("Deve aceitar descricao não enviada", () => {
        const dados = {
            nome: "Portfólio"
        }

        const resultado = cadastrarProjetoSchema.safeParse(dados);

        expect(resultado.success).toBe(true)
    })
})

describe("atualizarProjetoSchema", () => {
    test("Deve aceitar descricao com null", () => {
        const dados = {
            descricao: null
        }

        const resultado = atualizarProjetoSchema.safeParse(dados);

        expect(resultado.success).toBe(true)
    })

    test("Deve rejeitar uma atualização sem campos", () => {
        const dados = {}

        const resultado = atualizarProjetoSchema.safeParse(dados);

        expect(resultado.success).toBe(false)
    })

    test("Deve aceitar dados válidos", () => {
        const dados = {
            nome: "Estudar Machine Learning",
            descricao: null
        }

        const resultado = atualizarProjetoSchema.safeParse(dados);

        expect(resultado.success).toBe(true)
    })
})
