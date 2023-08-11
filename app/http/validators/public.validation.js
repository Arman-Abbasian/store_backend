const Joi = require("@hapi/joi");
const createError = require("http-errors");
const { MongoIDPattern } = require("../../utils/constans");

const idPublicValidation = Joi.object({
    id: Joi.string().required().regex(MongoIDPattern)
    .messages({'any.required': `param is a required field`})
    .error(createError.BadRequest("params is not true"))
});

module.exports = {
    idPublicValidation
}