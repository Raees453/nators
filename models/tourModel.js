const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a cover image'],
    },
    createdAt: { type: Date, default: Date.now(), select: false },
    price: { type: Number, required: [true, 'Tour must have a price'] },
    rating: { type: Number, default: 4.5 },
    duration: { type: Number, required: [true, 'Tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a maximum group size property'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty level'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: Number,
    summary: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    images: [String],
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: {
          type: Number,
          required: [true, 'Please add day number for location as well'],
        },
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   },
    // ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email -_id',
  });

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'reviews',
    select: 'review rating -_id',
  });

  next();
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
