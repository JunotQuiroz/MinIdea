const express = require("express");

const {
    listarAutores,
    mostrarAutor,
    registrarAutor
} = require("../controllers/authorsController");

const router = express.Router();

router.get("/", listarAutores);

router.post("/", registrarAutor);

router.get("/:id", mostrarAutor);

module.exports = router;