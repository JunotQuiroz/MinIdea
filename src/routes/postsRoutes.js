
const express = require("express");

const {
    listarPublicaciones,
    mostrarPublicacion
} = require("../controllers/postsController");

const router = express.Router();

router.get("/", listarPublicaciones);

router.get("/:id", mostrarPublicacion);

module.exports = router;
