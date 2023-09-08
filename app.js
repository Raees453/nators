const express = require('express');
const ApiError = require('./utils/api_error');
const globalErrorHandler = require('./utils/global_error_handler');

const TOURS_API_END_POINT = '/api/v1/tours';
const USERS_API_END_POINT = '/api/v1/users';

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE
// app.use((req, res, next) => {
//     console.log("Middleware!");
//     next();
// });

app.use(express.json());
app.use(express.static(`${__dirname}/public/`));

app.use(TOURS_API_END_POINT, toursRouter);
app.use(USERS_API_END_POINT, usersRouter);

app.all('*', (req, res, next) =>
  next(new ApiError(`Can't find ${req.originalUrl} on server`, 404)),
);

app.use(globalErrorHandler);

module.exports = app;
