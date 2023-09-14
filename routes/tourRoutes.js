const express = require('express');
const controller = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoutes');

const { authorize } = require('../controllers/authController');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(authorize, controller.getTours)
  // TODO insert role should be only assigned to admin or lead guide only
  .post(authorize, controller.addTour);

// API Aliasing...
router
  .route('/top-5-cheap')
  .get(authorize, controller.top5Cheap, controller.getTours);

router
  .route('/:id')
  .get(controller.getTourById)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
