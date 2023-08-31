const Tour = require("../models/tourModel");

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_LIMIT_SIZE = 100;
const DEFAULT_SORTING_CRITERIA = "-createdAt";
const QUERIES_TO_EXCLUDE = ['page', 'sort', 'limit', 'fields'];
const DEFAULT_RESPONSE_UNSELECTED_FIELD = "-__v";

class FilterApi {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObject = {...this.queryString};
        QUERIES_TO_EXCLUDE.forEach(query => delete queryObject[query]);

        const queryStr = JSON.stringify(queryObject).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {

        let sortQuery = this.queryString.sort;
        if (sortQuery) {
            sortQuery = sortQuery.split(",").join(" ");
        } else {
            sortQuery = DEFAULT_SORTING_CRITERIA;
        }

        this.query = this.query.sort(sortQuery);

        return this;
    }

    paginate() {

        if (this.queryString.page || this.queryString.limit) {
            const page = +this.queryString.page || DEFAULT_PAGE_NUM;
            const limit = +this.queryString.limit || DEFAULT_LIMIT_SIZE;
            const skip = (page - 1) * limit;

            this.query = this.query.skip(skip).limit(limit);
        }

        return this;
    }

    selectSpecifiedFieldsOnly = () => {


        let fields = this.queryString.fields;
        if (fields) {
            fields = fields.split(",").join(" ") + DEFAULT_RESPONSE_UNSELECTED_FIELD;
        } else {
            fields = DEFAULT_RESPONSE_UNSELECTED_FIELD;
        }

        this.query = this.query.select(fields);

        return this;
    }

}

module.exports = FilterApi;
