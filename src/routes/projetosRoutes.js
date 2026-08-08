import { Router } from "express";
import { listarProjetosController, buscarProjetoPorIdController, listarTarefasPorProjetoController, cadastrarProjetoController, atualizarProjetoController, deletarProjetoController } from "../controllers/projetosController.js";
import { validarRequisicao } from "../middlewares/validarRequisicao.js";
import { atualizarProjetoSchema, cadastrarProjetoSchema } from "../schemas/projetosSchemas.js";
import { idParamsSchema } from "../schemas/comunsSchemas.js";

const projetosRouter = Router();

projetosRouter.get("/", listarProjetosController);

projetosRouter.get("/:id", validarRequisicao(idParamsSchema, "params"),buscarProjetoPorIdController);

projetosRouter.get("/:id/tarefas", validarRequisicao(idParamsSchema, "params"), listarTarefasPorProjetoController);

projetosRouter.post("/", validarRequisicao(cadastrarProjetoSchema), cadastrarProjetoController);

projetosRouter.patch("/:id", validarRequisicao(idParamsSchema, "params"), validarRequisicao(atualizarProjetoSchema), atualizarProjetoController);

projetosRouter.delete("/:id", validarRequisicao(idParamsSchema, "params"), deletarProjetoController)

export { projetosRouter };