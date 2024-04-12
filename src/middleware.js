function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Oh- Not Found - ${req.originalUrl}`);
    next(error);
}


export {
    notFound,
};