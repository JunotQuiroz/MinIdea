const {
    obtenerAutores,
    obtenerAutorPorId,
    crearAutor,
    actualizarAutorPorId,
    eliminarAutorPorId
} = require("../services/authorsService");

async function listarAutores(req, res, next) {
    try {
        const autores = await obtenerAutores();

        return res.status(200).json(autores);

    } catch (error) {
        next(error);
    }
}

async function mostrarAutor(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return res.status(400).json({
                error: "El ID debe ser un entero positivo válido"
            });
        }

        const autor = await obtenerAutorPorId(id);

        if (!autor) {
            return res.status(404).json({
                error: "Autor no encontrado"
            });
        }

        return res.status(200).json(autor);

    } catch (error) {
        next(error);
    }
}

async function registrarAutor(req, res, next) {
    try {
        const { name, email, bio } = req.body ?? {};

        if (
            typeof name !== "string" ||
            name.trim().length === 0 ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                error: "El nombre debe contener entre 1 y 100 caracteres"
            });
        }

        if (
            typeof email !== "string" ||
            email.trim().length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                error: "El correo electrónico no es válido"
            });
        }

        if (bio !== undefined && bio !== null && typeof bio !== "string") {
            return res.status(400).json({
                error: "La biografía debe ser texto"
            });
        }

        const autor = await crearAutor(
            name.trim(),
            email.trim().toLowerCase(),
            bio == null ? null : bio.trim()
        );

        return res.status(201).json(autor);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: "El correo electrónico ya está registrado"
            });
        }

        next(error);
    }
}

async function actualizarAutor(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return res.status(400).json({
                error: "El ID debe ser un entero positivo válido"
            });
        }

        const { name, email, bio } = req.body ?? {};

        if (
            typeof name !== "string" ||
            name.trim().length === 0 ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                error: "El nombre debe contener entre 1 y 100 caracteres"
            });
        }

        if (
            typeof email !== "string" ||
            email.trim().length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                error: "El correo electrónico no es válido"
            });
        }

        if (bio != null && typeof bio !== "string") {
            return res.status(400).json({
                error: "La biografía debe ser texto"
            });
        }

        const autor = await actualizarAutorPorId(
            id,
            name.trim(),
            email.trim().toLowerCase(),
            bio == null ? null : bio.trim()
        );

        if (!autor) {
            return res.status(404).json({
                error: "Autor no encontrado"
            });
        }

        return res.status(200).json(autor);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: "El correo electrónico ya está registrado"
            });
        }

        next(error);
    }
}


async function eliminarAutor(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return res.status(400).json({
                error: "El ID debe ser un entero positivo válido"
            });
        }

        const autor = await eliminarAutorPorId(id);

        if (!autor) {
            return res.status(404).json({
                error: "Autor no encontrado"
            });
        }

        return res.status(200).json({
            message: "Autor eliminado correctamente",
            autor: autor
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    listarAutores,
    mostrarAutor,
    registrarAutor,
    actualizarAutor,
    eliminarAutor
};