const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");

//validation client mobile number
const getOtpSchema = Joi.object({
    mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/).error(createHttpError.BadRequest("mobile is not true"))
});
//validation client mobile number and code
const checkOtpSchema = Joi.object({
    mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/).error(createHttpError.BadRequest("mobile is not true")),
    code : Joi.string().min(4).max(6).error(createHttpError.BadRequest("code is not true"))
})
const updateProfileSchema = Joi.object({
    first_name : Joi.string().min(2).max(50).error(createHttpError.BadRequest("first name is not true")),
    last_name : Joi.string().min(2).max(50).error(createHttpError.BadRequest("last name is not true")),
    email:Joi.string().email().error(createHttpError.BadRequest("email is not true"))
})
module.exports = {
    getOtpSchema,
    checkOtpSchema,
    updateProfileSchema
}