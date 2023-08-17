const Joi = require("@hapi/joi");
const createError = require("http-errors");

const { MongoIDPattern } = require("../../../../utils/constans");

const createEpisodeSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("title of episode is not true")),
    text: Joi.string().min(10).max(80).error(createError.BadRequest("text of episode is not true")),
    type: Joi.string().regex(/(lock|unlock)/i).error(createError.BadRequest("type of episode is not true")),
    chapterID: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("chapterID is not true")),
    courseID: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("courseID is not true")),
    videoURL : Joi.allow(),
    fileUploadPath:Joi.allow(),
    filename:Joi.allow(),
});

module.exports = {
    createEpisodeSchema
}