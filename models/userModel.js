const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter username'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Please enter an email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email',
    },
  },
  photo: { type: String },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: [true, 'Please enter a password'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please enter confirm password'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Password and Confirm password are not same',
    },
  },
  createdAt: { type: Date, default: Date.now(), select: false },
  passwordChangedAt: { type: Date, default: undefined },
});

userSchema.pre('save', async function (next) {
  // no need to updated again if the profile is changed or something gets stored
  // and saved again
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = function (
  passwordToCompare,
  userPassword
) {
  return bcrypt.compare(passwordToCompare, userPassword);
};

userSchema.methods.passwordChangedAfterTokenIssued = function (timestamp) {
  if (this.passwordChangedAt !== undefined) {
    const passwordChangedTimestamp = +(this.passwordChangedAt.getTime() / 1000);

    // TODO It's not working if the password was changed after the token was issued
    return passwordChangedTimestamp > timestamp;
  }
  return true;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
