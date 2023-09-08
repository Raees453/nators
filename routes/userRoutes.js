const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-password',
  authController.authorize,
  authController.updatePassword,
);

router.patch(
  '/update-user',
  authController.authorize,
  userController.updateMyData,
);

module.exports = router;
