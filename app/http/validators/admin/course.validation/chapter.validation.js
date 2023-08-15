const Joi = require("@hapi/joi");
const createError = require("http-errors");
const { MongoIDPattern } = require("../../../../utils/constans");

const createChapterSchema = Joi.object({
    id: Joi.string().regex(MongoIDPattern),
    title : Joi.string().required().min(3).max(30).error(createError.BadRequest("title of chapter is not true")),
    text: Joi.string().min(10).max(80).error(createError.BadRequest("text of chapter is not true")),
});
const editChapterSchema = Joi.object({
    title : Joi.string().required().min(3).max(30).error(createError.BadRequest("title of chapter is not true")),
    text: Joi.string().min(10).max(80).error(createError.BadRequest("text of chapter is not true")),
});

module.exports = {
    createChapterSchema,
    editChapterSchema
}