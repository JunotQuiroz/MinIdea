
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

test("GET /authors devuelve la lista de autores", async () => {
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
            `http://127.0.0.1:${puerto}/authors`
        );

        assert.equal(respuesta.status, 200);

        const autores = await respuesta.json();

        assert.ok(Array.isArray(autores));

        assert.ok(
            autores.some((autor) => autor.email === "ana@ejemplo.com")
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

test("GET /authors/999999 devuelve 404", async () => {
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
            `http://127.0.0.1:${puerto}/authors/999999`
        );

        assert.equal(respuesta.status, 404);

        const datos = await respuesta.json();

        assert.equal(typeof datos.error, "string");

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


test("POST /authors crea un autor válido", async () => {
    let servidor;
    let baseVerificada = false;

    const email = `prueba.minidea.${Date.now()}@ejemplo.com`;

    try {
        const db = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(db.rows[0].nombre, "minidea_test");
        baseVerificada = true;

        servidor = app.listen(0, "127.0.0.1");

        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/authors`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "Autor de prueba",
                    email: email,
                    bio: "Registro temporal para testing"
                })
            }
        );

        assert.equal(respuesta.status, 201);

        const autor = await respuesta.json();

        assert.equal(autor.email, email);
        assert.equal(autor.name, "Autor de prueba");

        const resultado = await pool.query(
            "SELECT id, name, email FROM authors WHERE email = $1",
            [email]
        );

        assert.equal(resultado.rows.length, 1);
        assert.equal(resultado.rows[0].id, autor.id);

    } finally {
        if (baseVerificada) {
            await pool.query(
                "DELETE FROM authors WHERE email = $1",
                [email]
            );
        }

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


test("POST /authors rechaza un autor sin nombre", async () => {
    let servidor;
    let baseVerificada = false;

    const email = `prueba.invalida.${Date.now()}@ejemplo.com`;

    try {
        const db = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(db.rows[0].nombre, "minidea_test");
        baseVerificada = true;

        servidor = app.listen(0, "127.0.0.1");

        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/authors`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    bio: "Autor sin nombre"
                })
            }
        );

        assert.equal(respuesta.status, 400);

        const datos = await respuesta.json();

        assert.equal(typeof datos.error, "string");

        const resultado = await pool.query(
            "SELECT id FROM authors WHERE email = $1",
            [email]
        );

        assert.equal(resultado.rows.length, 0);

    } finally {
        if (baseVerificada) {
            await pool.query(
                "DELETE FROM authors WHERE email = $1",
                [email]
            );
        }

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

