const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.authorize, reviewController.getReviews)
  .post(
    authController.authorize,
    authController.checkIfUserRoleIsValid('user'),
    reviewController.createReview,
  );

module.exports = router;
