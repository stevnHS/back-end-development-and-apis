const notFoundHandler = (req, res, next) => {
    const error = new Error(`Cannot find ${req.originalUrl}`);
    error.status = 404;
    next(error);
}

const finalErrorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.status || 500
    const result = {
        error: true,
        status: status,
        message: status === 500 ? `Internal Server Error (Check Server Logs)` : err.message
    };
    
    res.status(status).json(result)
}

export{
    notFoundHandler,
    finalErrorHandler
}