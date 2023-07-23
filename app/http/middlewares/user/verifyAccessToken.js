const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../../../models/users");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../../utils/constans");

function getToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || [];
  if (token && bearer.toLowerCase()==="bearer") return token;
  throw createHttpError.Unauthorized("please enter your account");
}
function VerifyAccessToken(req, res, next) {
  try {
    //get the token
    const token = getToken(req.headers);
    //verify the token
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      try {
        if (err) throw createHttpError.Unauthorized("please enter your account");
        const { mobile } = payload || {};
        const user = await UserModel.findOne(
          { mobile },
          { password: 0, otp: 0 }
        );
        if (!user) throw createHttpError.Unauthorized("please enter your account");
        //attach a new property to req =>req.user
        req.user = user;
        return next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}
async function VerifyAccessTokenInGraphQL(req) {
  try {
    const token = getToken(req.headers);
    const { mobile } = JWT.verify(token, ACCESS_TOKEN_SECRET_KEY)
    const user = await UserModel.findOne(
      { mobile },
      { password: 0, otp: 0 }
    );
    if (!user) throw new createHttpError.Unauthorized("حساب کاربری یافت نشد");
    return user
  } catch (error) {
    throw new createHttpError.Unauthorized()
  }
}
module.exports = {
  VerifyAccessToken,
  getToken,
  VerifyAccessTokenInGraphQL
};
