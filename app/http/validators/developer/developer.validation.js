const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");

//validation client password
const checkPassword = Joi.object({
    password : Joi.string().required("password is required").error(createHttpError.BadRequest("password format is not true"))
});

module.exports = {
    checkPassword,
    
}