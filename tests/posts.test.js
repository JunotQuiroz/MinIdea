
const test = require("node:test");
const { after } = require("node:test");
const assert = require("node:assert/strict");

if (
    process.env.NODE_ENV !== "test" ||
    process.env.PGDATABASE !== "minidea_test"
) {
    throw new Error("Entorno de pruebas incorrecto");
}

const app = require("../src/app");
const pool = require("../src/db/pool");

after(async () => {
    await pool.end();
});

test("GET /posts/author/1 devuelve publicaciones del autor", async () => {
    let servidor;

    try {
        const db = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(db.rows[0].nombre, "minidea_test");

        servidor = app.listen(0, "127.0.0.1");

        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/posts/author/1`
        );

        assert.equal(respuesta.status, 200);

        const publicaciones = await respuesta.json();

        assert.ok(Array.isArray(publicaciones));

        assert.ok(publicaciones.length > 0);

        assert.ok(
            publicaciones.every(
                (publicacion) => publicacion.author_id === 1
            )
        );

        assert.ok(
            publicaciones.some(
                (publicacion) => publicacion.title === "Mi primera idea"
            )
        );

    } finally {
        if (servidor?.listening) {
            await new Promise((resolve, reject) => {
                servidor.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }
    }
});


test("GET /posts/abc rechaza un ID inválido", async () => {
    let servidor;

    try {
        const db = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(db.rows[0].nombre, "minidea_test");

        servidor = app.listen(0, "127.0.0.1");

        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/posts/abc`
        );

        assert.equal(respuesta.status, 400);

        const datos = await respuesta.json();

        assert.equal(
            datos.error,
            "El ID debe ser un entero positivo válido"
        );

    } finally {
        if (servidor?.listening) {
            await new Promise((resolve, reject) => {
                servidor.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }
    }
});


test("PUT /posts/:id actualiza una publicación", async () => {
    let servidor;
    let publicacionId;

    try {
        const db = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(db.rows[0].nombre, "minidea_test");

        const autores = await pool.query(
            "SELECT id FROM authors WHERE email = $1",
            ["ana@ejemplo.com"]
        );

        assert.equal(autores.rows.length, 1);

        const authorId = autores.rows[0].id;

        const creado = await pool.query(
            `INSERT INTO posts (author_id, title, content, published)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [
                authorId,
                "Publicación temporal",
                "Contenido original",
                false
            ]
        );

        publicacionId = creado.rows[0].id;

        servidor = app.listen(0, "127.0.0.1");

        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/posts/${publicacionId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    author_id: authorId,
                    title: "Publicación actualizada",
                    content: "Contenido actualizado",
                    published: true
                })
            }
        );

        assert.equal(respuesta.status, 200);

        const verificacion = await pool.query(
            `SELECT title, content, published
             FROM posts
             WHERE id = $1`,
            [publicacionId]
        );

        assert.equal(
            verificacion.rows[0].title,
            "Publicación actualizada"
        );

        assert.equal(
            verificacion.rows[0].content,
            "Contenido actualizado"
        );

        assert.equal(
            verificacion.rows[0].published,
            true
        );

    } finally {
        if (servidor?.listening) {
            await new Promise((resolve, reject) => {
                servidor.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }

        if (publicacionId !== undefined) {
            await pool.query(
                "DELETE FROM posts WHERE id = $1",
                [publicacionId]
            );
        }
    }
});


test("DELETE /posts/:id elimina una publicación", async () => {
    let servidor;
    let publicacionId;

    try {
        const db = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(db.rows[0].nombre, "minidea_test");

        const autores = await pool.query(
            "SELECT id FROM authors WHERE email = $1",
            ["ana@ejemplo.com"]
        );

        assert.equal(autores.rows.length, 1);

        const authorId = autores.rows[0].id;

        const creado = await pool.query(
            `INSERT INTO posts (author_id, title, content, published)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [
                authorId,
                "Publicación para eliminar",
                "Contenido temporal de prueba",
                false
            ]
        );

        publicacionId = creado.rows[0].id;

        servidor = app.listen(0, "127.0.0.1");

        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/posts/${publicacionId}`,
            {
                method: "DELETE"
            }
        );

        assert.equal(respuesta.status, 200);

        const verificacion = await pool.query(
            "SELECT id FROM posts WHERE id = $1",
            [publicacionId]
        );

        assert.equal(verificacion.rows.length, 0);

    } finally {
        if (servidor?.listening) {
            await new Promise((resolve, reject) => {
                servidor.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }

        if (publicacionId !== undefined) {
            await pool.query(
                "DELETE FROM posts WHERE id = $1",
                [publicacionId]
            );
        }
    }
});
