const Joi = require("@hapi/joi");
const createError = require("http-errors");

const { MongoIDPattern } = require("../../../utils/constans");

const createProductSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("title of product is not true")),
    text: Joi.string().min(10).max(80).error(createError.BadRequest("text of product is not true")),
    short_text: Joi.string().min(5).max(60).error(createError.BadRequest("short text of product is not true")),
    //tags of products that are array
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("maximum 20 item")),
    //colors of product that is array
    colors: Joi.array().min(0).max(20).error(createError.BadRequest("maximum 20 color")),
    //for validation of mongoId you can use form the regex
    category: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("title is not found")),
    price: Joi.number().error(createError.BadRequest("price is not true")),
    discount: Joi.number().error(createError.BadRequest("discount is not true")),
    count: Joi.number().error(createError.BadRequest("number of product is not true")),
    weight: Joi.number().allow(null, 0, "0").error(createError.BadRequest("weight of product is not true")),
    length: Joi.number().allow(null, 0, "0").error(createError.BadRequest("length of product is not true")),
    height: Joi.number().allow(null, 0, "0").error(createError.BadRequest("height of product is not true")),
    width: Joi.number().allow(null, 0, "0").error(createError.BadRequest("width of product is not true")),
    //when you want to make a field with limited accepted value use from the regex
    type: Joi.string().regex(/(virtual|physical)/i),
    filename: Joi.string().required().regex(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createError.BadRequest("image is not true")),
    fileUploadPath : Joi.allow().required(),
    foldername:Joi.allow(),
    f:Joi.allow()
});
const editProductSchema = Joi.object({
    title : Joi.string().required().min(3).max(30).error(createError.BadRequest("title of product is not true")),
    text: Joi.string().required().min(10).max(80).error(createError.BadRequest("text of product is not true")),
    short_text: Joi.string().required().min(5).max(60).error(createError.BadRequest("short text of product is not true")),
    //tags of products that are array
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("maximum 20 item")),
    //colors of product that is array
    colors: Joi.array().min(0).max(20).error(createError.BadRequest("maximum 20 color")),
    //for validation of mongoId you can use form the regex
    category: Joi.string().required().regex(MongoIDPattern).error(createError.BadRequest("category is not found")),
    price: Joi.number().required().error(createError.BadRequest("price is not true")),
    discount: Joi.number().required().error(createError.BadRequest("discount is not true")),
    count: Joi.number().required().error(createError.BadRequest("number of product is not true")),
    weight: Joi.number().allow(null, 0, "0").error(createError.BadRequest("weight of product is not true")),
    length: Joi.number().allow(null, 0, "0").error(createError.BadRequest("length of product is not true")),
    height: Joi.number().allow(null, 0, "0").error(createError.BadRequest("height of product is not true")),
    width: Joi.number().allow(null, 0, "0").error(createError.BadRequest("width of product is not true")),
    //when you want to make a field with limited accepted value use from the regex
    type: Joi.string().regex(/(virtual|physical)/i),
});

module.exports = {
    createProductSchema,
    editProductSchema
}