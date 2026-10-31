
const express = require("express");

const {
    listarPublicaciones,
    mostrarPublicacion,
    registrarPublicacion
} = require("../controllers/postsController");

const router = express.Router();

router.get("/", listarPublicaciones);

router.post("/", registrarPublicacion);

router.get("/:id", mostrarPublicacion);

module.exports = router;
