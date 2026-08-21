const inputCleaner = (req, res, next) => {
    const body = req.body;
    if (body) {
        body.username && (body.username = req.body.username.toLowerCase())
        body.comment && (body.comment = body.comment.replace(/<[^>]*>/g, ''))
    }
    next();
}

const inputValidator = (req, res, next) => {
    if (req.body && req.body.username.length < 3) {
        return res.redir/form?error=Username must be at least 3 characters.")
    }
    next();
}

export {
    inputCleaner,
    inputValidator
}