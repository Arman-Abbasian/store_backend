const Joi = require("@hapi/joi");
const createError = require("http-errors");

const { MongoIDPattern } = require("../../../../utils/constans");

const createEpisodeSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("عنوان دوره صحیح نمیباشد")),
    text: Joi.string().error(createError.BadRequest("متن ارسال شده صحیح نمیباشد")),
    type: Joi.string().regex(/(lock|unlock)/i),
    chapterID: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("شناسه ی فصل صحیح نمیباشد")),
    courseID: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("شناسه ی دوره صحیح نمیباشد")),
    filename: Joi.string().regex(/(\.mp4|\.mov|\.mkv|\.mpg)$/).error(createError.BadRequest("ویدیو ارسال شده صحیح نمیباشد")),
    fileUploadPath : Joi.allow()
});

module.exports = {
    createEpisodeSchema
}