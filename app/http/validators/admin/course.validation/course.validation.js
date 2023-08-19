const Joi = require("@hapi/joi");
const createError = require("http-errors");

const { MongoIDPattern } = require("../../../../utils/constans");

const createCourseSchema = Joi.object({
    title : Joi.string().required().min(3).max(30).error(createError.BadRequest("title of course is not true")),
    text: Joi.string().required().min(10).max(80).error(createError.BadRequest("text of course is not true")),
    short_text: Joi.string().required().min(5).max(60).error(createError.BadRequest("short_text of course is not true")),
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("maximum tag is 20")),
    category: Joi.string().required().regex(MongoIDPattern).error(createError.BadRequest("category of course is not true")),
    discountedPrice: Joi.number().required().error(createError.BadRequest("discountedprice of course is not true")),
    price: Joi.number().required().error(createError.BadRequest("price of course is not true")),
    discount: Joi.number().required().error(createError.BadRequest("discount of course is not true")),
    type: Joi.string().required().regex(/(free|cash|special)/i),
    foldername:Joi.allow(),
    fileUploadPath:Joi.allow(),
    filename:Joi.allow(),
    image:Joi.allow(),
});
const editCourseSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("title of course is not true")),
    text: Joi.string().min(10).max(80).error(createError.BadRequest("text of course is not true")),
    short_text: Joi.string().min(5).max(60).error(createError.BadRequest("short_text of course is not true")),
    tags: Joi.array().allow("").min(0).max(20).error(createError.BadRequest("maximum tag is 20")),
    discountedPrice: Joi.number().error(createError.BadRequest("discountedprice of course is not true")),
    price: Joi.number().error(createError.BadRequest("price of course is not true")),
    discount: Joi.number().error(createError.BadRequest("discount of course is not true")),
    type: Joi.string().allow("").regex(/(free|cash|special)/i),
    foldername:Joi.allow(),
    fileUploadPath:Joi.allow(),
    newFilename:Joi.allow(),
    previousFilename:Joi.allow(),
    image:Joi.allow(),
    imageURL:Joi.allow()
});
module.exports = {
    createCourseSchema,
    editCourseSchema
}