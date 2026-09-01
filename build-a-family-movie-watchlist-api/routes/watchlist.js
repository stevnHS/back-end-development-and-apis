import express from "express";
import {authenticate} from "../middleware/authenticate.js";
import {authorizeModification} from "../middleware/authorize.js";
import { addMovie, getWatchlist, updateMovie, deleteMovie } from "../utils/db.js";

const router = express.Router();

router.get("{/:userId}", authenticate, (req, res) => {
    const userId = Number(req.params.userId);
    const watchlist = getWatchlist(userId);
    res.json( watchlist );
});

router.post("{/:userId}/movies", authenticate, authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const watchlist = addMovie(userId, req.body);
    res.status(201).json({ message: "Movie added to watchlist successfully", watchlist });
});

router.put("{/:userId}/movies{/:movieId}", authenticate, authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const movie = updateMovie(userId, movieId, req.body);
    res.status(200).json({ message: "Movie updated successfully", movie });
});

router.delete("{/:userId}/movies{/:movieId}", authenticate, authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const watchlist = deleteMovie(userId, movieId);
    res.status(200).json({ message: "Movie removed from watchlist successfully", watchlist });
});

export default router;