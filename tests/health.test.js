
const test = require("node:test");
const assert = require("node:assert/strict");

if (
    process.env.NODE_ENV !== "test" ||
    process.env.PGDATABASE !== "minidea_test"
) {
    throw new Error("Entorno de pruebas incorrecto");
}

const app = require("../src/app");

test("GET /health responde correctamente", async () => {
    const servidor = app.listen(0, "127.0.0.1");

    try {
        await new Promise((resolve) => {
            servidor.once("listening", resolve);
        });

        const puerto = servidor.address().port;

        const respuesta = await fetch(
            `http://127.0.0.1:${puerto}/health`
        );

        assert.equal(respuesta.status, 200);

        const datos = await respuesta.json();

        assert.deepEqual(datos, {
            status: "ok",
            project: "MinIdea"
        });

    } finally {
        await new Promise((resolve, reject) => {
            servidor.close((error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }
});
