const User = require('../models/userModel');
const ApiError = require('../utils/api_error');
const asyncHandler = require('../utils/async_handler');

const filterUserFromBody = ({ name }) => {
  return {
    name,
  };
};

const sanitizeUserBeingSent = (user) => {
  user.__v = undefined;
};

exports.updateMe = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { _id: id } = req.user;

  if (password) {
    return next(
      new ApiError('Please use forgot password route to update password', 400),
    );
  }

  const filteredUser = filterUserFromBody(req.body);

  // checking if the body is not empty
  if (JSON.stringify(filteredUser) === '{}') {
    return next(
      new ApiError('Please specify the body of request as well', 404),
    );
  }

  const user = await User.findByIdAndUpdate(id, filteredUser, {
    new: true,
    runValidators: true,
  });

  sanitizeUserBeingSent(user);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
  const { _id: id } = req.user;

  if (!id) {
    return next(new ApiError('No user found', 404));
  }

  const user = await User.findById(id);

  user.active = false;

  await user.saveForce();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
