const express = require('express');
const controller = require('../controllers/tourController');
const {authorize, checkIfUserRoleIsValid} = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authorize, controller.getTours)
    .post(authorize, checkIfUserRoleIsValid('admin', 'lead-guide'), controller.addTour);

// API Aliasing...
router.route('/top-5-cheap').get(authorize, controller.top5Cheap, controller.getTours);

router
    .route('/:id')
    .get(authorize, controller.getTourById)
    .patch(authorize, checkIfUserRoleIsValid('admin', 'lead-guide'), controller.updateTour)
    .delete(authorize, checkIfUserRoleIsValid('admin', 'lead-guide'), controller.deleteTour);

module.exports = router;
