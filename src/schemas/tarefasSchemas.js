import * as z from "zod";

const cadastrarTarefaSchema = z.strictObject({
    titulo: z.string().trim().min(1, "Titulo é obrigatório"),
    descricao: z.string().trim().optional(),
    prioridade: z.string({
      error: (erro) => erro.input === undefined ? "Prioridade é obrigatória" 
      : "Prioridade deve ser texto"
    }).trim().toLowerCase().pipe(z.enum(["baixa", "media", "alta"]), {
        error: "Prioridade inválida"
    }),
    projetoId: z.number().int("O projetoId deve ser um número inteiro").positive("O projetoId deve ser maior que zero").optional()
});

const atualizarTarefaSchema = cadastrarTarefaSchema.extend({
    projetoId: z.number().int("O projetoId deve ser um numero inteiro").positive("O projetoId deve ser maior que zero").nullable()
}).partial().refine(dados => Object.keys(dados).length > 0, {
    error: "Envie pelo menos um campo para atualizar"
})

const listarTarefasQuerySchema = z.strictObject({
    concluida: z.enum(["true","false"]).transform(valor => {
        return valor === "true";
    }).optional(),
    prioridade: z.enum(["baixa","media","alta"]).optional(),
    pagina: z.coerce.number().int("A página deve ser um número inteiro").positive("A página deve ser maior que zero").default(1),
    limite: z.coerce.number().int("O limite deve ser um número inteiro").positive("O limite deve ser maior que zero").default(10)
})


export { cadastrarTarefaSchema, atualizarTarefaSchema, listarTarefasQuerySchema };
 