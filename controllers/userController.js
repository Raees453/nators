const User = require('../models/userModel');
const ApiError = require('../utils/api_error');
const asyncHandler = require('../utils/async_handler');

exports.updateMyData = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { _id: id } = req.user;

  if (!password || !confirmPassword || password !== confirmPassword) {
    return next(
      new ApiError('Please provide password and confirm password', 400),
    );
  }

  const user = await User.findById(id).select('+password');

  const isSamePassword = await user.comparePassword(password, user.password);

  if (!isSamePassword) {
    return next(new ApiError('Invalid Password', 401));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
