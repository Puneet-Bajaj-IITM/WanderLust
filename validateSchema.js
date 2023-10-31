const joi = require("joi");

module.exports.validateListingSchema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        type:  joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().min(0).required(),
        image: joi.object(),
    }).required()


module.exports.validateReviewSchema = joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required(),
    }).required()
