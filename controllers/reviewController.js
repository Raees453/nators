const Review = require('../models/reviewModel');

const asyncHandler = require('../utils/async_handler');

exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find().select('-__v');

  return res.status(200).json({
    success: true,
    results: reviews?.length || 0,
    data: reviews,
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;

  const userReview = await Review.create({ review, rating, tour, user });

  return res.status(201).json({
    status: true,
    data: userReview,
  });
});
