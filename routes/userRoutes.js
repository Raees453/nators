const fs = require('fs');
const express = require('express');

const controller = require('../controllers/userController');
const filePath = `${__dirname}/../dev-data/data/users.json`;
const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);

router.route('/').get(controller.getAllUsers).post(controller.postUser);

router
  .route('/:id')
  .get(controller.getUserById)
  .patch(controller.patchUserById)
  .delete(controller.deleteUserById);

module.exports = router;
