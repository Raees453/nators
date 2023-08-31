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
            message: 'Please enter a valid email'
        },
    },
    photo: {type: String},
    password: {
        type: String,
        minlength: 8,
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
    // createdAt: { Date, default: Date.now(), select: false },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt(this.password, 12);

    this.confirmPassword = undefined;

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
