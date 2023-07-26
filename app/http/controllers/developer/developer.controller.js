const createError = require("http-errors");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const bcrypt=require("bcrypt");
const { checkPassword } = require("../../validators/developer/developer.validation");
const { RandomNumberGenerator } = require("../../../utils/functions");
const { Controller } = require("../controller");


class DeveloperController extends Controller {
  async hashPassword(req, res, next) {
    try {
      console.log(req.params)
      await checkPassword.validateAsync(req.params)
        const {password}=req.params;
    const salt=bcrypt.genSaltSync(10);
    const hashPassword=bcrypt.hashSync(password,salt);
    return res.status(HttpStatus.OK).json({
        StatusCode: HttpStatus.OK,
        data: {
          hashPassword
        }
      })
    } catch (error) {
        next(error)
    }
  }

  async randomNumber(req, res, next) {
    try {
    const randomNumber= RandomNumberGenerator()
    return res.status(HttpStatus.OK).json({
        StatusCode: HttpStatus.OK,
        data: {
          randomNumber
        }
      })
    } catch (error) {
        next(error)
    }

  }

}
module.exports = {
    DeveloperController: new DeveloperController()
}