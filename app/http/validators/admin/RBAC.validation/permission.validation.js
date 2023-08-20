const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");

const addPermissionSchema = Joi.object({
    name : Joi.string().required().min(3).max(30).error(createHttpError.BadRequest("name of permission is not true")),
    description : Joi.string().required().min(5).max(100).error(createHttpError.BadRequest("description of permission is not true")),
});
const editPermissionSchema = Joi.object({
    name : Joi.string().allow("").min(3).max(30).error(createHttpError.BadRequest("name of permission is not true")),
    description : Joi.string().allow("").min(5).max(100).error(createHttpError.BadRequest("description of permission is not true")),
});

module.exports = {
    addPermissionSchema,
    editPermissionSchema
}