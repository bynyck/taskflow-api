import * as z from 'zod';

export const idParamsSchema = z.strictObject({
    id: z.coerce.number({error: "O id deve ser um numero"}).int("O id deve ser um número inteiro").positive("O id deve ser positivo")
})

