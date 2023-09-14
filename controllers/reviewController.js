const Review = require('../models/reviewModel');

const asyncHandler = require('../utils/async_handler');

exports.getReviews = asyncHandler(async (req, res, next) => {
  let filter;

  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  const reviews = await Review.find(filter);

  return res.status(200).json({
    success: true,
    results: reviews?.length || 0,
    data: reviews,
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  // for nested routing meaning
  // /tourId/reviews/create-review
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const { review, rating, tour, user } = req.body;

  const userReview = await Review.create({ review, rating, tour, user });

  return res.status(201).json({
    status: true,
    data: userReview,
  });
});
