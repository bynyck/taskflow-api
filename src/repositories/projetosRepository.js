import { pool } from "../database/conexao.js";

async function listarProjetosRepository() {
    const resultado = await pool.query(`
        SELECT 
        id,
        nome,
        descricao,
        criado_em AS "criadoEm"
        FROM projetos
    `)

    return resultado.rows;
}

async function buscarProjetoPorIdRepository(id) {
    const resultado = await pool.query(`
            SELECT id,nome,descricao, criado_em AS "criadoEm" 
            FROM projetos WHERE id = $1;
        `,[id]);
    
    return resultado.rows[0];
}

async function cadastrarProjetoRepository(dados) {
    const { nome, descricao = null } = dados;

    const resultado = await pool.query(`
        INSERT INTO projetos (nome, descricao)
        VALUES ($1, $2)
        RETURNING
            id,
            nome,
            descricao,
            criado_em AS "criadoEm"    
    `,[nome,descricao]);

    return resultado.rows[0];
}

async function atualizarProjetoRepository(id, dados) {
    const campos = [];
    const valores = [];

    const { nome, descricao } = dados;

    if(nome !== undefined) {
        valores.push(nome);
        campos.push(`nome = $${valores.length}`);
    }

    if(descricao !== undefined) {
        valores.push(descricao);
        campos.push(`descricao = $${valores.length}`);
    }

    valores.push(id);

    const marcadorId = valores.length;

    const camposSql = campos.join(", ");

    const sql = `
        UPDATE projetos
        SET ${camposSql} WHERE id = $${marcadorId}
        RETURNING
            id,
            nome,
            descricao,
            criado_em AS "criadoEm"
    `

    const resultado = await pool.query(sql, valores);

    return resultado.rows[0];
}

async function deletarProjetoRepository(id) {
    const resultado = await pool.query(`
        DELETE FROM projetos WHERE id = $1
        RETURNING
            id,
            nome,
            descricao,
            criado_em AS "criadoEm"
        `,[id]);

    return resultado.rows[0];
}

export { buscarProjetoPorIdRepository, listarProjetosRepository, cadastrarProjetoRepository, atualizarProjetoRepository, deletarProjetoRepository };