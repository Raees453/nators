const Tour = require('../models/tourModel');

const factoryHandler = require('../utils/factoryHandler');

exports.getTourFromBody = (req, res, next) => {
  const {
    startLocation,
    guides,
    name,
    imageCover,
    price,
    rating,
    duration,
    maxGroupSize,
    difficulty,
    ratingsQuantity,
    summary,
    description,
    images,
    startDates,
    locations,
    reviews,
  } = req.body;

  req.modelToAdd = {
    startLocation,
    guides,
    name,
    images,
    price,
    duration,
    maxGroupSize,
    imageCover,
    difficulty,
    ratingsQuantity,
    rating,
    summary,
    description,
    startDates,
    locations,
    reviews,
  };

  next();
};

exports.top5Cheap = async (req, res, next) => {
  req.query.limit = 5;
  req.query.page = 1;
  req.query.sort = 'sort=price,-ratingAverage';

  next();
};

// TODO Add One for Create Tours not working
exports.addTour = factoryHandler.addOne(Tour);
exports.updateTour = factoryHandler.updateOne(Tour);
exports.deleteTour = factoryHandler.deleteOne(Tour);
exports.getTours = factoryHandler.findMany(Tour);
exports.getTourById = factoryHandler.findOne(Tour, {
  path: 'reviews',
  select: 'review rating name',
});
