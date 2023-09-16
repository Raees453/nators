const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getReviews);

router.use(authController.authorize);
router.use(authController.checkIfUserRoleIsValid('user'));

router
  .route('/')
  .post(reviewController.attachReviewToRequest, reviewController.addReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
