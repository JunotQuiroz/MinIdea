const express = require("express");

const authorsRoutes = require("./routes/authorsRoutes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/authors", authorsRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        project: "MinIdea"
    });
});

app.listen(PORT, () => {
    console.log(`MinIdea funcionando en http://localhost:${PORT}`);
});