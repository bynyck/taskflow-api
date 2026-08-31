import express from "express";
import cors from "cors";
import { tarefasRouter } from "./routes/tarefasRoutes.js";
import { projetosRouter } from "./routes/projetosRoutes.js";
import { registrarRequisicao } from "./middlewares/registrarRequisicao.js";
import { rotaNaoEncontrada } from "./middlewares/rotaNaoEncontrada.js";
import { tratarErros } from "./middlewares/tratarErros.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(registrarRequisicao);

app.get("/", (req,res) => {
    return res.send("Hello World");
})

app.use("/tarefas", tarefasRouter);

app.use("/projetos", projetosRouter);

app.use(rotaNaoEncontrada);

app.use(tratarErros);

export default app;