
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
