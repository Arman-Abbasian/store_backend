const Joi = require("@hapi/joi");
const createError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constans");
const createBlogSchema = Joi.object({
    title : Joi.string().required().min(3).max(50)
    .messages({
        'string.base': `blog title should be a type of 'text'`,
        'string.empty': `blog title cannot be an empty field`,
        'string.min': `blog title should have a minimum length of 3`,
        'string.max': `blog title should have a maximum length of 50`,
        'any.required': `blog title is a required field`
      }),
    text: Joi.string().required().min(80)
    .messages({
        'string.base': `blog text should be a type of 'text'`,
        'string.min': `blog text should have a min length of 80 character`,
        'any.required': `blog text is a required field`
      }),
    short_text: Joi.string().required().min(15).max(100)
    .messages({
        'string.base': `short_text of title should be a type of 'text'`,
        'string.min': `short_text of title should have a minimum length of 15`,
        'string.max': `short_text of title should have a maximum length of 100`,
        'any.required': `short_text of title is a required field`
      })
    .error(createError.BadRequest("short_text of title is not true")),
    //fileUploadPath is made by us with middleware=>is the link  of saved image
    fileUploadPath : Joi.allow(),
     //filename is made by us with middleware=>is the name of saved image
    filename: Joi.string().required().pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createError.BadRequest("sent image is not true")),
    tags: Joi.array().max(20)
    .messages({
        'array.base': `tags of title should be a array of 'text'`,
        'string.max': `number of tags could be maximum 20`,
      })
    .error(createError.BadRequest("sent tags is not true")),
    //is the id of related category
    category: Joi.string().pattern(MongoIDPattern).error(createError.BadRequest("category is not true")),
    image:Joi.allow(),
});

module.exports = {
    createBlogSchema
}