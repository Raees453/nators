const Review = require('../models/reviewModel');

const factoryHandler = require('../utils/factoryHandler');

exports.attachReviewToRequest = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  if (!req.body.tour) {
    req.body.tour = req.params.id;
  }

  const { review, rating, tour, user } = req.body;

  req.modelToAdd = { review, rating, tour, user };

  next();
};

exports.getReviews = factoryHandler.findMany(Review);
exports.getReview = factoryHandler.findOne(Review);
exports.addReview = factoryHandler.addOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
