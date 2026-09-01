import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided." });
    }
    const token = authHeader.split(" ")[1];

    // if (isBlacklisted(token)) {
    //     return res.status(401).json({ error: "Token has been blacklisted" });
    // }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = decoded;
    next();
};