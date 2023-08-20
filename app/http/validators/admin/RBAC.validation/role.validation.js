const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");

const { MongoIDPattern } = require("../../../../utils/constans");

const addRoleSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest("عنوان نقش صحیح نمیباشد")),
    description : Joi.string().min(0).max(100).error(createHttpError.BadRequest("توضیحات نقش صحیح نمیباشد")),
    permissions : Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createHttpError.BadRequest("دسترسی های ارسال شده صحیح نمیباشد")),
});


module.exports = {
    addRoleSchema,
}