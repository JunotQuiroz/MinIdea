
const test = require("node:test");
const assert = require("node:assert/strict");

if (
    process.env.NODE_ENV !== "test" ||
    process.env.PGDATABASE !== "minidea_test"
) {
    throw new Error("Entorno de pruebas incorrecto");
}

const pool = require("../src/db/pool");

test("PostgreSQL utiliza minidea_test", async () => {
    try {
        const resultado = await pool.query(
            "SELECT current_database() AS nombre"
        );

        assert.equal(
            resultado.rows[0].nombre,
            "minidea_test"
        );
    } finally {
        await pool.end();
    }
});
