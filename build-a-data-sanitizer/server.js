import express from "express";
import { inputCleaner, inputValidator } from "./middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use('/form', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "public")))

app.get("/", (req, res) => {
    res.redirect('/form')
})

app.post("/submit", inputCleaner, inputValidator, (req, res) => {
    res.json({
        username: req.body.username,
        comment: req.body.comment,
    })
})

app.listen(3000)