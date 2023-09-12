const express = require('express');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const ApiError = require('./utils/api_error');

const globalErrorHandler = require('./utils/global_error_handler');

const TOURS_API_END_POINT = '/api/v1/tours';
const USERS_API_END_POINT = '/api/v1/users';
const REVIEWS_API_END_POINT = '/api/v1/reviews';

const HPP_WHITE_LISTED_FIELDS = [
  'ratingsQuantity',
  'duration',
  'maxGroup',
  'difficulty',
  'price',
];

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// MIDDLEWARE
// app.use((req, res, next) => {
//     console.log("Middleware!");
//     next();
// });

// should be put at the beginning always
// set security http headers
app.use(helmet());

const limit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: 'Too many requests',
});

// set rate limit
app.use('/api', limit);

// convert data to json
app.use(express.json());

// data sanitization for no-sql attacks
// throws error if some query is been sent
app.use(sanitize());

// data sanitization for xss attacks
// removes the < from the code like html
app.use(xss());

// prevent parameter pollution by simply fetching the last one only
// it whitelists the fields mentioned
app.use(hpp({ whitelist: HPP_WHITE_LISTED_FIELDS }));

// access public or asset files
app.use(express.static(`${__dirname}/public/`));

// api routes
app.use(TOURS_API_END_POINT, toursRouter);
app.use(USERS_API_END_POINT, usersRouter);
app.use(REVIEWS_API_END_POINT, reviewRouter);

// invalid route
app.all('*', (req, res, next) =>
  next(new ApiError(`Can't find ${req.originalUrl} on server`, 404)),
);

app.use(globalErrorHandler);

module.exports = app;
