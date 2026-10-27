const express = require("express");

const {
    listarAutores,
    mostrarAutor,
    registrarAutor,
    actualizarAutor
} = require("../controllers/authorsController");

const router = express.Router();

router.get("/", listarAutores);

router.post("/", registrarAutor);

router.get("/:id", mostrarAutor);

router.put("/:id", actualizarAutor);

module.exports = router;