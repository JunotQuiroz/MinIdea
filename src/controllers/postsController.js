const {
    obtenerPublicaciones,
    obtenerPublicacionPorId
} = require("../services/postsService");

async function listarPublicaciones(req, res, next) {
    try {
        const publicaciones = await obtenerPublicaciones();

        return res.status(200).json(publicaciones);

    } catch (error) {
        next(error);
    }
}

async function mostrarPublicacion(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return res.status(400).json({
                error: "El ID debe ser un entero positivo válido"
            });
        }

        const publicacion = await obtenerPublicacionPorId(id);

        if (!publicacion) {
            return res.status(404).json({
                error: "Publicación no encontrada"
            });
        }

        return res.status(200).json(publicacion);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    listarPublicaciones,
    mostrarPublicacion
};