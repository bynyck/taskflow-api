import { Router } from "express";
import { listarProjetosController, buscarProjetoPorIdController, cadastrarProjetoController, atualizarProjetoController, deletarProjetoController } from "../controllers/projetosController.js";
import { validarRequisicao } from "../middlewares/validarRequisicao.js";
import { atualizarProjetoSchema, cadastrarProjetoSchema } from "../schemas/projetosSchemas.js";

const projetosRouter = Router();

projetosRouter.get("/", listarProjetosController);

projetosRouter.get("/:id", buscarProjetoPorIdController);

projetosRouter.post("/", validarRequisicao(cadastrarProjetoSchema), cadastrarProjetoController);

projetosRouter.patch("/:id", validarRequisicao(atualizarProjetoSchema), atualizarProjetoController);

projetosRouter.delete("/:id", deletarProjetoController)

export { projetosRouter };