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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now, select: false },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo -_id',
  }).populate({
    path: 'tour',
    select: 'name rating -_id',
  });

  next();
});

// reviewSchema.post(/^find/, function (reviewModel) {
//   console.log('Hiiiiii', reviewModel);
//   reviewModel.__v = undefined;
//   console.log('Hiiiiii2', reviewModel.__v);
// });

module.exports = mongoose.model('Review', reviewSchema);
