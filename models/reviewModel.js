const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
  review: { type: String, required: [true, 'Please provide a review message'] },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide a rating'],
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Please provide a tour id'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id'],
  },
  createdAt: { type: Date, default: Date.now, select: false },
});

// TODO Ensure if a single review per user per tour is working or not as it should get a delay normally
// ensure only a review is published by a user to a tour
reviewSchema.index({ tour: -1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        numOfRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (!stats || stats.length === 0) {
    return;
  }

  Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].numOfRatings,
  });
};

reviewSchema.post('save', async function () {
  this.constructor.calculateAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();

  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  this.review.calculateAverageRatings(this.review.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

module.exports = mongoose.model('Review', reviewSchema);
