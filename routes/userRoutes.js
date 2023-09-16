const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.authorize);

router.patch('/update-password', authController.updatePassword);

router
  .route('/:id')
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router.get(
  '/',
  authController.checkIfUserRoleIsValid('admin', 'lead-guide'),
  usersController.getAllUsers,
);

module.exports = router;
