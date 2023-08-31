const ApiError = require("./api_error");


const handleCastErrorForDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ApiError(message, 400);
}

module.exports = globalErrorHandler = (error, req, res, next) => {
    // error.statusCode = error.statusCode || 500;
    // error.status = error.status || 'error';

    const env = process.env.NODE_ENV;

    if (env === 'production') {

        console.log("PRODUCTION RUNNING!!!!\n", error);

        let apiError = {...error};
        if (apiError.name === 'CastError') {
            apiError = handleCastErrorForDB(apiError);
        }

        sendProductionError(apiError, res);
    } else if (env === 'development') {
        sendDevelopmentError(error, res);
    }

    next();
}


const sendDevelopmentError = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error: error,
        stack: error.stack,
    });
}

const sendProductionError = (error, res) => {
    if (error.isOperational) {
        console.log("Is Operational called!");

        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {

        // console.error(error);

        res.status(500).json({
            status: "error",
            message: "Some unhandled error occurred!",
        });
    }
}
