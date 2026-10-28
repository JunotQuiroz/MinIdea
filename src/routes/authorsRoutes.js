const express = require("express");

const {
    listarAutores,
    mostrarAutor,
    registrarAutor,
    actualizarAutor,
    eliminarAutor
} = require("../controllers/authorsController");

const router = express.Router();

router.get("/", listarAutores);

router.post("/", registrarAutor);

router.get("/:id", mostrarAutor);

router.put("/:id", actualizarAutor);

router.delete("/:id", eliminarAutor);

module.exports = router;