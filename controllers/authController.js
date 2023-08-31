const User = require('../models/userModel');
const asyncHandler = require('../utils/async_handler');

exports.signUp = asyncHandler(() => async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    status: true,
    data: user,
  });

  next();
});
