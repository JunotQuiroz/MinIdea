
const express = require("express");


const {
    listarPublicaciones,
    mostrarPublicacion,
    registrarPublicacion,
    actualizarPublicacion,
    eliminarPublicacion
} = require("../controllers/postsController");

const router = express.Router();

router.get("/", listarPublicaciones);

router.post("/", registrarPublicacion);

router.get("/:id", mostrarPublicacion);

router.put("/:id", actualizarPublicacion);

router.delete("/:id", eliminarPublicacion);

module.exports = router;
