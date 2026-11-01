
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

module.exports = app;
