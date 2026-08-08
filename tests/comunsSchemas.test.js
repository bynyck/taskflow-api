import { describe, test, expect} from "vitest";
import { idParamsSchema } from "../src/schemas/comunsSchemas.js";

describe("idParamsSchema", () => {
    test("deve aceitar  o id", () => {

        const dados = {
            id: "8"
        };

        const resultado = idParamsSchema.safeParse(dados);

        expect(resultado.success).toBe(true);

        if(resultado.success) {
            expect(resultado.data.id).toBe(8);
        }
    })

    test("Deve rejeitar um id não numérico", () => {
        const dados = {
            id: "abc"
        };

        const resultado = idParamsSchema.safeParse(dados);

        expect(resultado.success).toBe(false);

    })

    test("Id deve ser um numero positivo", () => {
        const dados = {
            id: "0"
        };

        const resultado = idParamsSchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    })

    test("Id deve ser um numero inteiro", () => {
        const dados = {
            id: "1.5"
        };

        const resultado = idParamsSchema.safeParse(dados);

        expect(resultado.success).toBe(false);
    })
})