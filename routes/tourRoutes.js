const express = require("express");
const controller = require("../controllers/tourController")

const router = express.Router();

router.route("/")
    .get(controller.getTours)
    .post(controller.addTour);

// API Aliasing...
router.route("/top-5-cheap")
    .get(controller.top5Cheap, controller.getTours);

router.route("/:id")
    .get(controller.getTourById)
    .patch(controller.updateTour)
    .delete(controller.deleteTour);


module.exports = router;
