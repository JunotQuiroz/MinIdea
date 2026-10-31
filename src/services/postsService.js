const pool = require("../db/pool");

async function obtenerPublicaciones() {
    const resultado = await pool.query(
        `SELECT
            p.id,
            p.author_id,
            a.name AS author_name,
            p.title,
            p.content,
            p.published
         FROM posts AS p
         INNER JOIN authors AS a
            ON p.author_id = a.id
         ORDER BY p.id`
    );

    return resultado.rows;
}

async function obtenerPublicacionPorId(id) {
    const resultado = await pool.query(
        `SELECT
            p.id,
            p.author_id,
            a.name AS author_name,
            p.title,
            p.content,
            p.published
         FROM posts AS p
         INNER JOIN authors AS a
            ON p.author_id = a.id
         WHERE p.id = $1`,
        [id]
    );

    return resultado.rows[0];
}

async function crearPublicacion(authorId, title, content, published) {
    const resultado = await pool.query(
        `INSERT INTO posts (author_id, title, content, published)
         VALUES ($1, $2, $3, $4)
         RETURNING id, author_id, title, content, published`,
        [authorId, title, content, published]
    );

    return resultado.rows[0];
}

module.exports = {
    obtenerPublicaciones,
    obtenerPublicacionPorId,
    crearPublicacion
};
