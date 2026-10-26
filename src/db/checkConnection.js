const pool = require("./pool");

async function probarConexion() {
    try {
        const resultado = await pool.query(
            "SELECT current_database() AS database"
        );

        console.log("Conectado a:", resultado.rows[0].database);

    } catch (error) {
        console.error("Error de conexión:", error.message);
        process.exitCode = 1;

    } finally {
        await pool.end();
    }
}

probarConexion();