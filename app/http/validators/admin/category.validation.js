const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constans");

const addCategorySchema = Joi.object({
    title : Joi.string().min(3).max(20)
    .messages({
        'string.base': `"title should be a type of 'text'`,
        'string.empty': `title cannot be an empty field`,
        'string.min': `title should have a minimum length of 3`,
        'string.max': `title should have a maximum length of 20`,
        'any.required': `title is a required field`
      }),
    
    parent: Joi.string().allow('').pattern(MongoIDPattern).allow('').error(createHttpError.BadRequest("parent is not true"))
});
const updateCategorySchema = Joi.object({
    title : Joi.string().min(3).max(30)
    .messages({
        'string.base': `"title should be a type of 'text'`,
        'string.empty': `title cannot be an empty field`,
        'string.min': `title should have a minimum length of 3`,
        'string.max': `title should have a maximum length of 20`,
      })
    .error(createHttpError.BadRequest("title is not true")),
});

module.exports = {
    addCategorySchema,
    updateCategorySchema
}