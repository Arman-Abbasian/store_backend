const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../utils/constans");

const idPublicValidation = Joi.object({
    id: Joi.string().required().pattern(MongoIDPattern)
    .messages({'any.required': `param is a required field`})
    .error(createHttpError.BadRequest("params is not true"))
});

module.exports = {
    idPublicValidation
}