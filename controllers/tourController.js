const Tour = require("../models/tourModel");
const FilterApi = require("../utils/filter_api");
const APIError = require("../utils/api_error");
const asyncHandler = require("../utils/async_handler");


exports.top5Cheap = async (req, res, next) => {
    req.query.limit = 5;
    req.query.page = 1;
    req.query.sort = "sort=price,-ratingAverage";
    next();
}

exports.getTours = asyncHandler(async (req, res, next) => {
    const filterApi = new FilterApi(Tour.find(), req.query)
        .filter().sort().paginate().selectSpecifiedFieldsOnly();

    const tours = await filterApi.query;

    return res.status(200).json({
        status: "success", length: tours.length, tours
    });
});

exports.getTourById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const tour = await Tour.findById(id, '-__v');

    // TODO
    if (!tour) {
        return next(new APIError(`No tour found for id: ${id}`, 404));
    }

    return res.status(200).json({
        status: "success", data: tour
    });
});

exports.addTour = asyncHandler(async (req, res, next) => {
    const tour = await Tour.create(req.body);
    return res.status(200).json({
        status: "success", id: tour.id, tour,
    });
});

exports.updateTour = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true
    });

    if (!tour) {
        return next(new APIError(`No tour found for id: ${id}`, 404));
    }

    return res.status(200).json({
        status: "success", tour,
    });
});

exports.deleteTour = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
        return next(new APIError(`No tour found for id: ${id}`, 404));
    }

    return res.status(204).json({
        status: "success",
    });
});
