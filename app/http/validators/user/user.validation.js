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
module.exports = {
    getOtpSchema,
    checkOtpSchema
}