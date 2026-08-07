import { Router } from "express";
import { validarRequisicao } from "../middlewares/validarRequisicao.js";
import { cadastrarTarefaSchema, atualizarTarefaSchema, listarTarefasQuerySchema } from "../schemas/tarefasSchemas.js";

import { listarTarefasController, buscarTarefaPorIdController, cadastrarTarefaController, atualizarTarefaController, concluirTarefaController, reabrirTarefaController, deletarTarefaController } from "../controllers/tarefasController.js";

const tarefasRouter = Router();

tarefasRouter.get("/", validarRequisicao(listarTarefasQuerySchema, "query"),listarTarefasController);

tarefasRouter.get("/:id", buscarTarefaPorIdController);

tarefasRouter.post("/", validarRequisicao(cadastrarTarefaSchema), cadastrarTarefaController);

tarefasRouter.patch("/:id", validarRequisicao(atualizarTarefaSchema), atualizarTarefaController);

tarefasRouter.patch("/:id/concluir", concluirTarefaController);

tarefasRouter.patch("/:id/reabrir", reabrirTarefaController);

tarefasRouter.delete("/:id",deletarTarefaController)

export {
    tarefasRouter
}