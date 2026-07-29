import { pool } from "../database/conexao.js";

async function listarTarefasRepository() {
  const resultado = await pool.query(`
    SELECT
      id,
      titulo,
      descricao,
      prioridade,
      concluida,
      criado_em AS "criadoEm"
    FROM tarefas
    ORDER BY criado_em DESC;
    `)

    return resultado.rows;
}

async function buscarTarefaPorIdRepository(id) {
    const resultado = await pool.query(`
      SELECT
        id,
        titulo,
        descricao,
        prioridade,
        concluida,
        criado_em AS "criadoEm"
      FROM tarefas
      WHERE id = $1
      `, [id]);

    return resultado.rows[0];
}

async function cadastrarTarefaRepository(dados) {

  const { titulo, descricao = null, prioridade } = dados;

  const resultado = await pool.query(`INSERT INTO tarefas (titulo, descricao, prioridade) VALUES ($1, $2, $3) RETURNING
    id,
    titulo,
    descricao,
    prioridade,
    concluida,
    criado_em AS "criadoEm"
    `,[titulo,descricao,prioridade]);

  return resultado.rows[0];

}

async function atualizarTarefaRepository(id, dados) {
    const campos = [];
    const valores = [];

    const { titulo, descricao, prioridade } = dados;

    if (titulo !== undefined) {
      valores.push(titulo);
      campos.push(`titulo = $${valores.length}`)
    }

    if (descricao !== undefined) {
      valores.push(descricao);
      campos.push(`descricao = $${valores.length}`);
    }

    if (prioridade !== undefined) {
      valores.push(prioridade);
      campos.push(`prioridade = $${valores.length}`);
    }

    valores.push(id);

    const marcadorId = valores.length;

    const camposSql = campos.join(", ");

    const sql = `
      UPDATE tarefas
      SET ${camposSql} WHERE id = $${marcadorId}
      RETURNING
      id,
      titulo,
      descricao,
      prioridade,
      concluida,
      criado_em AS "criadoEm";
    `

    const resultado = await pool.query(sql, valores);

    return resultado.rows[0];
}

async function concluirTarefaRepository(id) {
  const resultado = await pool.query(`
    UPDATE tarefas
    SET concluida = true
    Where id = $1
    RETURNING
    id,titulo, descricao,prioridade,
    concluida, criado_em AS "criadoEm"
    `, [id]);

    return resultado.rows[0];
}

async function reabrirTarefaRepository(id) {
  const resultado = await pool.query(`
    UPDATE tarefas
    SET concluida = false
    WHERE id = $1
    RETURNING
    id,titulo, descricao,prioridade,
    concluida, criado_em AS "criadoEm"
    `,[id]);

    return resultado.rows[0];
}

async function deletarTarefaRepository(id) {
  const resultado = await pool.query(`
    DELETE FROM tarefas WHERE id = $1
    RETURNING
    id,titulo, descricao,prioridade,
    concluida, criado_em AS "criadoEm"
    `,[id]);

    return resultado.rows[0];
}
export { listarTarefasRepository, buscarTarefaPorIdRepository, cadastrarTarefaRepository, atualizarTarefaRepository,concluirTarefaRepository, reabrirTarefaRepository, deletarTarefaRepository };
