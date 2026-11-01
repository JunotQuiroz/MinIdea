
const express = require("express");

const authorsRoutes = require("./routes/authorsRoutes");
const postsRoutes = require("./routes/postsRoutes");

const app = express();

app.use(express.json());

app.use("/authors", authorsRoutes);
app.use("/posts", postsRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        project: "MinIdea"
    });
});


app.use((error, req, res, next) => {
    console.error("Error en MinIdea:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "El formato JSON es inválido"
        });
    }

    return res.status(500).json({
        error: "Error interno del servidor"
    });
});

module.exports = app;
