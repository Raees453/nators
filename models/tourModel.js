const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
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
  maxGroup: {
    type: Number,
    required: [true, 'Tour must have a maximum group property'],
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
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
