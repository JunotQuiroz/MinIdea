const pool = require("../db/pool");

async function obtenerAutores() {
    const resultado = await pool.query(
        "SELECT id, name, email, bio, created_at FROM authors ORDER BY id"
    );

    return resultado.rows;
}

async function obtenerAutorPorId(id) {
    const resultado = await pool.query(
        "SELECT id, name, email, bio, created_at FROM authors WHERE id = $1",
        [id]
    );

    return resultado.rows[0];
}

async function crearAutor(name, email, bio) {
    const resultado = await pool.query(
        "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id, name, email, bio, created_at",
        [name, email, bio]
    );

    return resultado.rows[0];
}

async function actualizarAutorPorId(id, name, email, bio) {
    const resultado = await pool.query(
        `UPDATE authors
         SET name = $1,
             email = $2,
             bio = $3
         WHERE id = $4
         RETURNING id, name, email, bio, created_at`,
        [name, email, bio, id]
    );

    return resultado.rows[0];
}

module.exports = {
    obtenerAutores,
    obtenerAutorPorId,
    crearAutor,
    actualizarAutorPorId
};