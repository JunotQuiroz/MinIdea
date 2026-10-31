
const express = require("express");

const {
    listarPublicaciones,
    mostrarPublicacion,
    registrarPublicacion,
    actualizarPublicacion,
    eliminarPublicacion,
    obtenerPublicacionesDeAutor
} = require("../controllers/postsController");


const router = express.Router();

router.get("/", listarPublicaciones);

router.post("/", registrarPublicacion);

router.get("/author/:authorId", obtenerPublicacionesDeAutor);

router.get("/:id", mostrarPublicacion);

router.put("/:id", actualizarPublicacion);

router.delete("/:id", eliminarPublicacion);

module.exports = router;
