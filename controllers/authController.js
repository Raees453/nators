const { createHash } = require('crypto');
const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const ApiError = require('../utils/api_error');
const User = require('../models/userModel');
const asyncHandler = require('../utils/async_handler');
const { sendEmail } = require('../utils/email');

const signToken = (id) => {
  const secret = process.env.JWT_SECTET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign({ id }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECTET;
  return promisify(jwt.verify)(token, secret);
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, photo, password, confirmPassword } = req.body;
  const user = await User.create({
    name,
    email,
    photo,
    password,
    confirmPassword,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: true,
    token,
    data: user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // if email & password exists
  if (!email || !password) {
    return next(new ApiError('Please provide email & password', 400));
  }

  // if user exists & valid password
  const user = await User.findOne({ email }).select('+password');

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

  // Check if user changed password after token issued
  //   const isPasswordChanged = user.passwordChangedAfterTokenIssued(
  //     userDetailsObject.iat
  //   );

  //   console.log('Password changed after', isPasswordChanged);

  //   if (isPasswordChanged) {
  //     return next(
  //       new ApiError('Your password was changed, please login again!', 401)
  //     );
  //   }

  req.user = user;
  next();
});

exports.checkIfUserRoleIsValid =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403),
      );
    }

    next();
  };

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError('No user found for email', 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset Password',
      text: `Forgot Password? Hit the url to reset \n${resetUrl}`,
    });

    res.status(200).json({
      success: true,
      data: 'A token has been sent to your email!',
    });
  } catch (err) {
    console.log(err);

    user.passwordResetToken = undefined;
    user.userpasswordResetExpiresAt = undefined;

    user.saveForce();

    return next(new ApiError('Something went wrong', 500));
  }
};

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;

  const passwordResetToken = createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    // expires is greater than right now
    passwordResetExpiresAt: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ApiError('No user found or the token expired', 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;

  await user.saveForce(true);

  const signedToken = signToken(user._id);

  res.status(200).json({
    success: true,
    token: signedToken,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { _id: id } = req.user;

  const { password, newPassword, newConfirmPassword } = req.body;

  // get user from database
  const user = await User.findById({ _id: id }).select('+password');

  const isPasswordSame = await user.comparePassword(password, user.password);

  // check if password is valid
  if (!user || !isPasswordSame) {
    return next(new ApiError('Invalid password', 401));
  }

  const isBothPasswordsSame = await user.comparePassword(
    newPassword,
    user.password,
  );

  if (isBothPasswordsSame) {
    return next(
      new ApiError('Please do not use the same password for new one', 400),
    );
  }

  // update if password is correct
  user.password = newPassword;
  user.confirmPassword = newConfirmPassword;

  await user.saveForce(true);

  req.user = user;

  // login with new password
  const signedToken = signToken(id);

  res.status(200).json({
    success: true,
    token: signedToken,
  });
});
