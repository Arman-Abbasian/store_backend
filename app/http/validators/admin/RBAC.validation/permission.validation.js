const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");

const addPermissionSchema = Joi.object({
    name : Joi.string().min(3).max(30).error(createHttpError.BadRequest("اسم دسترسی صحیح نمیباشد")),
    description : Joi.string().min(0).max(100).error(createHttpError.BadRequest("توضیحات دسترسی صحیح نمیباشد")),
});

module.exports = {
    addPermissionSchema
}