const Joi = require("@hapi/joi");
const createError = require("http-errors");

const { MongoIDPattern } = require("../../../utils/constans");

const createCourseSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("title of course is not true")),
    text: Joi.string().min(10).max(80).error(createError.BadRequest("text of course is not true")),
    short_text: Joi.string().min(5).max(60).error(createError.BadRequest("short_text of course is not true")),
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("maximum tag is 20")),
    category: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("category of course is not true")),
    discountedPrice: Joi.number().error(createError.BadRequest("discountedprice of course is not true")),
    price: Joi.number().error(createError.BadRequest("price of course is not true")),
    discount: Joi.number().error(createError.BadRequest("discount of course is not true")),
    type: Joi.string().regex(/(free|cash|special)/i),
    foldername:Joi.allow(),
    fileUploadPath:Joi.allow(),
    filename:Joi.allow(),
    image:Joi.allow(),
});
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
    createCourseSchema,
    createEpisodeSchema
}