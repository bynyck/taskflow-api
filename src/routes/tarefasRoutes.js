import { Router } from "express";
import { validarRequisicao } from "../middlewares/validarRequisicao.js";
import { cadastrarTarefaSchema, atualizarTarefaSchema, listarTarefasQuerySchema } from "../schemas/tarefasSchemas.js";
import { idParamsSchema } from "../schemas/comunsSchemas.js";

import { listarTarefasController, buscarTarefaPorIdController, cadastrarTarefaController, atualizarTarefaController, concluirTarefaController, reabrirTarefaController, deletarTarefaController } from "../controllers/tarefasController.js";

const tarefasRouter = Router();

tarefasRouter.get("/", validarRequisicao(listarTarefasQuerySchema, "query"),listarTarefasController);

tarefasRouter.get("/:id", validarRequisicao(idParamsSchema, "params"), buscarTarefaPorIdController);

tarefasRouter.post("/", validarRequisicao(cadastrarTarefaSchema), cadastrarTarefaController);

tarefasRouter.patch("/:id", validarRequisicao(idParamsSchema, "params"), validarRequisicao(atualizarTarefaSchema), atualizarTarefaController);

tarefasRouter.patch("/:id/concluir", validarRequisicao(idParamsSchema, "params"), concluirTarefaController);

tarefasRouter.patch("/:id/reabrir", validarRequisicao(idParamsSchema, "params"), reabrirTarefaController);

tarefasRouter.delete("/:id", validarRequisicao(idParamsSchema, "params"), deletarTarefaController)

export { tarefasRouter }