const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");

const { MongoIDPattern } = require("../../../../utils/constans");

const addRoleSchema = Joi.object({
    title : Joi.string().required().min(3).max(30).error(createHttpError.BadRequest("title of role is not true")),
    description : Joi.string().required().min(5).max(100).error(createHttpError.BadRequest("description of role is not true")),
    permissions : Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createHttpError.BadRequest("permissions is not true")),
});
const editRoleSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest("title of role is not true")),
    description : Joi.string().min(5).max(100).error(createHttpError.BadRequest("description of role is not true")),
    permissions : Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createHttpError.BadRequest("permissions is not true")),
});

module.exports = {
    addRoleSchema,
    editRoleSchema
}