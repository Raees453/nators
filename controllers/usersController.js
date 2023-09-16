const asyncHandler = require('../utils/async_handler');
const User = require('../models/userModel');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // get only users who are not deleted or are active
  const users = await User.find({ active: { $ne: false } }, '-__v +active');

  res.status(200).json({
    success: true,
    data: users,
  });
});
