import * as z from "zod";

const cadastrarProjetoSchema = z.strictObject({
    nome: z.string().trim().min(1, "Nome é obrigatório"),
    descricao: z.string().trim().optional()
})

const atualizarProjetoSchema = cadastrarProjetoSchema.extend({
    descricao: z.string().trim().optional().nullable()
}).partial().refine(dados => Object.keys(dados).length > 0, {
    error : "Envie pelo menos um campo para atualizar"
})

export { cadastrarProjetoSchema, atualizarProjetoSchema };