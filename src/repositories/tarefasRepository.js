import { pool } from "../database/conexao.js";

async function listarTarefasRepository(filtros) {
  const { concluida, prioridade, limite, offset } = filtros;

  let sql = `
      SELECT 
        t.id,
        t.titulo,
        t.descricao,
        t.prioridade,
        t.concluida,
        t.criado_em AS "criadoEm",
        t.projeto_id AS "projetoId",
        p.nome AS "projetoNome"
        FROM tarefas AS t
        LEFT JOIN projetos AS p
        ON t.projeto_id = p.id
    `;

  const condicoes = [];
  const valores = [];

  if (concluida !== undefined) {
    valores.push(concluida);
    condicoes.push(`t.concluida = $${valores.length}`);
  }

  if (prioridade !== undefined) {
    valores.push(prioridade);
    condicoes.push(`t.prioridade = $${valores.length}`);
  }

  if (condicoes.length > 0) {
    sql += `WHERE ${condicoes.join(" AND ")}`;
  }

  sql += ` ORDER BY t.criado_em DESC`;

  valores.push(limite);

  sql += ` LIMIT $${valores.length}`

  valores.push(offset);

  sql += ` OFFSET $${valores.length}`;

  const resultado = await pool.query(sql, valores);

  return resultado.rows;
}

async function contarTarefasRepository(filtros) {
  const { concluida, prioridade } = filtros;

  let sql = `
    SELECT COUNT(*) AS total
    FROM tarefas as t
  `;

  const condicoes = [];
  const valores = [];

  if (concluida !== undefined) {
    valores.push(concluida);
    condicoes.push(`t.concluida = $${valores.length}`);
  }

  if (prioridade !== undefined) {
    valores.push(prioridade);
    condicoes.push(`t.prioridade = $${valores.length}`);
  }

  if (condicoes.length > 0) {
    sql += `WHERE ${condicoes.join(" AND ")}`;
  }

  const resultado = await pool.query(sql, valores);

  return Number(resultado.rows[0].total);

}

async function buscarTarefaPorIdRepository(id) {
  const resultado = await pool.query(`
      SELECT
        t.id,
        t.titulo,
        t.descricao,
        t.prioridade,
        t.concluida,
        t.criado_em AS "criadoEm",
        t.projeto_id AS "projetoId",
        p.nome AS "projetoNome"
      FROM tarefas AS t
      LEFT JOIN projetos AS p
      ON t.projeto_id = p.id
      WHERE t.id = $1;
      `, [id]);

  return resultado.rows[0];
}

async function listarTarefasPorProjetoIdRepository(projetoId) {
  const resultado = await pool.query(`
        SELECT
          id,
          titulo,
          descricao,
          prioridade,
          concluida,
          criado_em AS "criadoEm"
        FROM tarefas
        WHERE projeto_id = $1
        ORDER BY criado_em DESC
    `, [projetoId]);

  return resultado.rows;
}

async function cadastrarTarefaRepository(dados) {

  const { titulo, descricao = null, prioridade, projetoId = null } = dados;

  const resultado = await pool.query(`INSERT INTO tarefas (titulo, descricao, prioridade, projeto_id) VALUES ($1, $2, $3, $4) RETURNING
    id,
    titulo,
    descricao,
    prioridade,
    concluida,
    criado_em AS "criadoEm",
    projeto_id AS "projetoId"
    `, [titulo, descricao, prioridade, projetoId]);

  return resultado.rows[0];

}

async function atualizarTarefaRepository(id, dados) {
  const campos = [];
  const valores = [];

  const { titulo, descricao, prioridade, projetoId } = dados;

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

  if (projetoId !== undefined) {
    valores.push(projetoId);
    campos.push(`projeto_id = $${valores.length}`);
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
      criado_em AS "criadoEm",
      projeto_id AS "projetoId";
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
    `, [id]);

  return resultado.rows[0];
}

async function deletarTarefaRepository(id) {
  const resultado = await pool.query(`
    DELETE FROM tarefas WHERE id = $1
    RETURNING
    id,titulo, descricao,prioridade,
    concluida, criado_em AS "criadoEm"
    `, [id]);

  return resultado.rows[0];
}
export { listarTarefasRepository, contarTarefasRepository, buscarTarefaPorIdRepository, listarTarefasPorProjetoIdRepository, cadastrarTarefaRepository, atualizarTarefaRepository, concluirTarefaRepository, reabrirTarefaRepository, deletarTarefaRepository };
