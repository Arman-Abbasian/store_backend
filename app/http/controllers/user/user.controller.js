const createError = require("http-errors");
const { ROLES } = require("../../../utils/constans");
const {SignAccessToken, VerifyRefreshToken, SignRefreshToken, getBasketOfUser, copyObject, deleteInvalidPropertyInObject } = require("../../../utils/functions");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { getOtpSchema, checkOtpSchema, updateProfileSchema } = require("../../validators/user/user.validation");
const { Controller } = require("../controller");
const { UserModel } = require("../../../models/users");
const { RandomNumberGenerator } = require("../../../utils/functions");

class UserController extends Controller {
  //clint send the mobile number 
  //1- validate mobile number
  //2-check the existance user based on mobile number in user collection (if user existed =>update otp field if not =>make a new user)
  async getOtp(req, res, next) {
    try {
      //check the validation of body(mobile)
      await getOtpSchema.validateAsync(req.body);
      const { mobile } = req.body;
      // make a 5 digit number
      const code = RandomNumberGenerator()
      const result = await this.saveUser(mobile, code)
      if (!result) throw createError.Unauthorized("can not login")
      return res.status(HttpStatus.OK).json({
        data: {
          statusCode:HttpStatus.OK,
          data: {
            message: "otp sent successfully",
            code,
            mobile
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
  async checkOtp(req, res, next) {
    try {
      //validate client mobile and code 
      await checkOtpSchema.validateAsync(req.body)
      const { mobile, code } = req.body;
      //find the user with mobile in User collection
      const user = await UserModel.findOne({ mobile }, { password: 0, refreshToken: 0, accessToken: 0})
      if (!user) throw createError.NotFound("user is not exist")
      //if the client otp code was not equal with the otp code in user Collection
      if (user.otp.code != code) throw createError.Unauthorized("code in not true");
      //check if the otp code not be expired
      const now = (new Date()).getTime();
      if (+user.otp.expiresIn < now) throw createError.Unauthorized("code is expired");
      //produce access token
      const accessToken = await SignAccessToken(user._id);
      //produce refresh token
      const refreshToken = await SignRefreshToken(user._id);
      //update refresh toke in UserModel
      const updateRefreshTokenFiled=await UserModel.updateOne({_id:user._id},{$set:{refreshToken:refreshToken}});
      if(updateRefreshTokenFiled. modifiedCount===0) throw createError[500]("server error")
      return res.status(HttpStatus.OK).json({
        statusCode : HttpStatus.OK,
        data: {
          accessToken,
          refreshToken,
          user
        }
      })
    } catch (error) {
      next(error)
    }
  }
  async refreshToken(req, res, next) {
    try {
      //the refresh toke sendet automatically and on time, when the access token become expired
      const { refreshToken } = req.body;
      //check if the refresh token is valid
      const user = await VerifyRefreshToken(refreshToken);
      //produce the new access token
      const accessToken = await SignAccessToken(user._id);
      //produce the new refresh token
      const newRefreshToken = await SignRefreshToken(user._id);
      //update refresh toke in UserModel
      const updateRefreshTokenFiled=await UserModel.updateOne({_id:user._id},{$set:{refreshToken:newRefreshToken}});
      if(updateRefreshTokenFiled. modifiedCount===0) throw createError[500]("server error")
      
      return res.status(HttpStatus.OK).json({
        StatusCode: HttpStatus.OK,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          user
        }
      })
    } catch (error) {
      next(error)
    }
  }
  // if user existed =>update otp field if not =>make a new user
  async saveUser(mobile, code) {
    // time of now
    const now = (new Date().getTime())
    let otp = {
      code,
      expiresIn: now  + 120000,
    }
    //the result of user variable is true or false
    const user = await this.checkExistUser(mobile);
    //if the user is already existed in user collection
    if (user){
      //check the otp field for user to see if the otp is still valid or  be expired
      if (+user.otp.expiresIn > now) throw createError.Forbidden("the last OTP is still valid")
      return (await this.updateUser(mobile, { otp }))
    }
    //if user not exist in user collection then make a new user
    return (await UserModel.create({
      mobile,
      otp,
      //as default all users are USER role
      Role: ROLES.USER
    }))
  }
  //update the profile of user
  async updateUserProfile(req, res, next){
    try {
        const userID = req.user._id;
        await updateProfileSchema.validateAsync(req.body)
        const data = copyObject(req.body);
        const BlackListFields = ["mobile", "otp", "bills", "discount", "Role", "Courses","products","_id","refreshToken","basket"]
        const validateData=deleteInvalidPropertyInObject(data, BlackListFields)
        const profileUpdateResult = await UserModel.updateOne({_id: userID}, { $set: validateData })
        if(!profileUpdateResult.modifiedCount) throw new createError.InternalServerError("server error")
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
                message: "profile updated successfully"
            }
        })
    } catch (error) {
        next(error)
    }
}
//get the profile of user
async userProfile(req, res, next){
    try {
        const user = req.user;
        //bill, courses, discount, 
        console.log(await getBasketOfUser(user._id));
        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
                user
            }
        })
    } catch (error) {
        next(error)
    }
}
  // the return of this function is the user data (if exist)
  async checkExistUser(mobile) {
    const user = await UserModel.findOne({ mobile });
    return user
  }
  //the return of this function is true(if update the user collection) of false(do not update the use collection)
  async updateUser(mobile, objectData = {}) {
    const wrongValues=["", " ", 0, null, undefined, "0", NaN]
    Object.keys(objectData).forEach(key => {
      if (wrongValues.includes(objectData[key])) delete objectData[key]
    })
    const updateResult = await UserModel.updateOne({ mobile }, { $set: objectData })
    return !!updateResult.modifiedCount
  }
}
module.exports = {
    UserController: new UserController()
}