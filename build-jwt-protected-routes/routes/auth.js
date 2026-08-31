import express from "express";
import { findByEmail } from "../utils/db.js";
import { randomUUID, sign } from "crypto";
import bcrypt from "bcryptjs";
import { readUsers, writeUsers } from "../utils/db.js";
import { signToken } from "../utils/jwt.js"
import authenticate from "../middleware/authenticate.js";
import {blacklistToken} from "../utils/token-blacklist.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = findByEmail(email);
    if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
    }

    const newUser = {
        id: randomUUID(),
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "user"
    }

    const users = readUsers();
    users.push(newUser);
    writeUsers(users);

    const token = signToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
    });
    res.status(201).json({ message: "User registered successfully", token });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = findByEmail(email);
    if (!existingUser) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, existingUser.passwordHash);
    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
    });
    res.json({ message: "Login successful", token });
});

router.get("/profile", authenticate, (req, res) => {
    res.json({ message: "Profile data retrieved successfully", user: req.user });
});

router.post("/logout", authenticate, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    blacklistToken(token);
    res.json({ message: "Logout successful" });
});

export default router;