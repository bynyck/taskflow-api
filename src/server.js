import app from "./app.js";
import { pool } from "./database/conexao.js";

const port = Number(process.env.PORT) || 3333;

async function testarConexao() {
    try {
        const resultado = await pool.query("SELECT 1 AS conectado");
        console.log("PostgreSQL conectado",resultado.rows[0].conectado);
    } catch (erro) {
        console.error("Erro ao conectar ao PostgreSQL", erro.message);
        process.exit(1);
    }
}

await testarConexao();

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})