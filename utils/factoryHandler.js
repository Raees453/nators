const APIError = require('./api_error');
const FilterApi = require('./filter_api');

const asyncHandler = require('./async_handler');

const sendResponse = (doc, res, next, status = 200) => {
  if (!doc) {
    return next(new APIError('No document found.', 404));
  }

  return res.status(status).json({
    status: 'success',
    results: doc.length,
    data: doc,
  });
};

exports.findOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findById(id).populate(populateOptions);

    return sendResponse(doc, res, next);
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    return sendResponse(doc, res, next);
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return sendResponse(doc, res, next);
  });

exports.addOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.modelToAdd);

    return sendResponse(doc, res, next, 201);
  } catch (err) {
    console.log('Error!!!', err);
  }
};

exports.findMany = (Model) =>
  asyncHandler(async (req, res, next) => {
    const filterApi = new FilterApi(Model.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .selectSpecifiedFieldsOnly();

    const docs = await filterApi.query;

    return sendResponse(docs, res, next);
  });
