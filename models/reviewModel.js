const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: { type: String, required: [true, 'Please provide a review message'] },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide a rating'],
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Please provide a tour id'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id'],
  },
  createdAt: { type: Date, default: Date.now, select: false },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.index({ tour: 1 });

module.exports = mongoose.model('Review', reviewSchema);
