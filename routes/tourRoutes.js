const express = require('express');
const tourController = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoutes');

const {
  authorize,
  checkIfUserRoleIsValid,
} = require('../controllers/authController');

const router = express.Router();

router.use('/:id/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.top5Cheap, tourController.getTours);

router
  .route('/')
  .get(tourController.getTours)
  .post(
    authorize,
    checkIfUserRoleIsValid('admin', 'lead-guide'),
    tourController.getTourFromBody,
    tourController.addTour,
  );

router.route('/:id').get(tourController.getTourById);

router.use(authorize);
router.use(checkIfUserRoleIsValid('admin', 'lead-guide'));

router
  .route('/:id')
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
