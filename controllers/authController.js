const {promisify} = require('util');

const jwt = require('jsonwebtoken');

const ApiError = require('../utils/api_error');
const User = require('../models/userModel');
const asyncHandler = require('../utils/async_handler');

const signToken = (id) => {
    const secret = process.env.JWT_SECTET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jwt.sign({id}, secret, {expiresIn});
};

const verifyToken = (token) => {
    const secret = process.env.JWT_SECTET;
    return promisify(jwt.verify)(token, secret);
};

exports.signUp = asyncHandler(async (req, res, next) => {
    const {name, email, photo, password, confirmPassword, role} = req.body;
    const user = await User.create({
        name,
        email,
        photo,
        password,
        confirmPassword,
        role
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: true,
        token,
        data: user,
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // if email & password exists
    if (!email || !password) {
        return next(new ApiError('Please provide email & password', 400));
    }

    // if user exists & valid password
    const user = await User.findOne({email}).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new ApiError('Invalid credentials provided', 401));
    }

    // everyting okay
    const token = signToken(user._id);

    // send token

    return res.status(200).json({
        success: true,
        token,
    });
});

exports.authorize = asyncHandler(async (req, res, next) => {
    // Get if token exists
    const authorization = req.headers.authorization;

    // TODO Message is not being displayed in production mode
    // but it does in production mode
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(new ApiError('Please login to get access!', 401));
    }

    // Validate token
    const token = authorization.split(' ')[1];
    const userDetailsObject = await verifyToken(token);

    // Check if user still exists
    const user = await User.findById(userDetailsObject.id);
    if (!user) {
        return next(new ApiError('User no longer exists', 401));
    }

    // TODO not working for simple tour fetching
    // even when it's valid
    // Check if user changed password after token issued
    // const isPasswordChanged = user.passwordChangedAfterTokenIssued(
    //     userDetailsObject.iat
    // );
    //
    // console.log('Password changed after', isPasswordChanged);
    //
    // if (isPasswordChanged) {
    //     return next(
    //         new ApiError('Your password was changed, please login again!', 401)
    //     );
    // }

    req.user = user;
    next();
});

exports.checkIfUserRoleIsValid = (...roles) => (req, res, next) => {

    if (!req.user || !req.user.role) {
        return new ApiError('Please execute the authorize method first', 401);
    }

    if (!roles.includes(req.user.role)) {
        return next(new ApiError('You do not have permission for this resource', 403));
    }

    next();
};
