export const authorizeModification = (req, res, next) => {
    if (
        !req.user ||
        (req.user.role !== "parent" && (req.user.role !== "child" || req.params.userId != req.user.id))
    ) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};
