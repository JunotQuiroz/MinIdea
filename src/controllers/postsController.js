
const {
    obtenerPublicaciones,
    obtenerPublicacionPorId,
    crearPublicacion,
    actualizarPublicacionPorId,
    eliminarPublicacionPorId,
    obtenerPublicacionesPorAutor
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


async function registrarPublicacion(req, res, next) {
    try {
        const {
            author_id,
            title,
            content,
            published = false
        } = req.body ?? {};

        if (
            !Number.isInteger(author_id) ||
            author_id < 1 ||
            author_id > 2147483647
        ) {
            return res.status(400).json({
                error: "El ID del autor debe ser un entero positivo válido"
            });
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "El título es obligatorio y debe ser texto"
            });
        }

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                error: "El contenido es obligatorio y debe ser texto"
            });
        }

        if (typeof published !== "boolean") {
            return res.status(400).json({
                error: "El estado published debe ser true o false"
            });
        }

        const publicacion = await crearPublicacion(
            author_id,
            title.trim(),
            content.trim(),
            published
        );

        return res.status(201).json(publicacion);

    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                error: "El autor indicado no existe"
            });
        }

        next(error);
    }
}


async function actualizarPublicacion(req, res, next) {
    try {
        const idTexto = req.params.id;
        const id = Number(idTexto);

        if (
            !/^[1-9]\d*$/.test(idTexto) ||
            !Number.isSafeInteger(id) ||
            id > 2147483647
        ) {
            return res.status(400).json({
                error: "El ID debe ser un entero positivo válido"
            });
        }

        const {
            author_id,
            title,
            content,
            published
        } = req.body ?? {};

        if (
            !Number.isInteger(author_id) ||
            author_id < 1 ||
            author_id > 2147483647
        ) {
            return res.status(400).json({
                error: "El ID del autor debe ser un entero positivo válido"
            });
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "El título es obligatorio y debe ser texto"
            });
        }

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                error: "El contenido es obligatorio y debe ser texto"
            });
        }

        if (typeof published !== "boolean") {
            return res.status(400).json({
                error: "El estado published debe ser true o false"
            });
        }

        const publicacion = await actualizarPublicacionPorId(
            id,
            author_id,
            title.trim(),
            content.trim(),
            published
        );

        if (!publicacion) {
            return res.status(404).json({
                error: "Publicación no encontrada"
            });
        }

        return res.status(200).json(publicacion);

    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                error: "El autor indicado no existe"
            });
        }

        next(error);
    }
}


async function eliminarPublicacion(req, res, next) {
    try {
        const idTexto = req.params.id;
        const id = Number(idTexto);

        if (
            !/^[1-9]\d*$/.test(idTexto) ||
            !Number.isSafeInteger(id) ||
            id > 2147483647
        ) {
            return res.status(400).json({
                error: "El ID debe ser un entero positivo válido"
            });
        }

        const publicacion = await eliminarPublicacionPorId(id);

        if (!publicacion) {
            return res.status(404).json({
                error: "Publicación no encontrada"
            });
        }

        return res.status(200).json({
            message: "Publicación eliminada correctamente",
            publicacion: publicacion
        });

    } catch (error) {
        next(error);
    }
}


async function obtenerPublicacionesDeAutor(req, res, next) {
    try {
        const authorIdTexto = req.params.authorId;
        const authorId = Number(authorIdTexto);

        if (
            !/^[1-9]\d*$/.test(authorIdTexto) ||
            !Number.isSafeInteger(authorId) ||
            authorId > 2147483647
        ) {
            return res.status(400).json({
                error: "El ID del autor debe ser un entero positivo válido"
            });
        }

        const publicaciones = await obtenerPublicacionesPorAutor(authorId);

        return res.status(200).json(publicaciones);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    listarPublicaciones,
    mostrarPublicacion,
    registrarPublicacion,
    actualizarPublicacion,
    eliminarPublicacion,
    obtenerPublicacionesDeAutor
};

