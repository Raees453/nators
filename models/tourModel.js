const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
    },
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
    duration: { type: Number, required: [true, 'Tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a maximum group size property'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty level'],
    },
    ratingsAverage: { type: Number, default: 4.5 },
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.index({ price: 1 });
tourSchema.index({ rating: 1 });

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email',
  });

  next();
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
