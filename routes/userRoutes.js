const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const usersController = require('../controllers/usersController');

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

router.patch('/update-me', authController.authorize, userController.updateMe);

router.delete('/delete-me', authController.authorize, userController.deleteMe);

router.get(
  '/',
  authController.authorize,
  // authController.checkIfUserRoleIsValid('admin'),
  usersController.getAllUsers,
);

module.exports = router;
