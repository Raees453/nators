const ApiError = require('./api_error');

const handleCastErrorForDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

const handleInvalidTokenError = () =>
  new ApiError('Please login again to get access', 401);

const handleTokenExpiredError = () =>
  new ApiError('Your session has expired. Please login again', 401);

module.exports = globalErrorHandler = (error, req, res, next) => {
  console.log(error);

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  error.message = error.message || 'Something went wrong';

  const env = process.env.NODE_ENV;

  if (env === 'production') {
    let apiError = { ...error };

    if (apiError.name === 'CastError') {
      apiError = handleCastErrorForDB(apiError);
    }

    if (apiError.name === 'JsonWebTokenError') {
      apiError = handleInvalidTokenError();
    }

    if (apiError.name === 'TokenExpiredError') {
      apiError = handleTokenExpiredError();
    }

    sendProductionError(apiError, res);
  } else if (env === 'development') {
    sendDevelopmentError(error, res);
  }

  next();
};

const sendDevelopmentError = (error, res) => {
  res.status(error.statusCode || 500).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const sendProductionError = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Some unhandled error occurred!',
    });
  }
};
