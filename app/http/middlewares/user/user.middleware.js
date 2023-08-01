const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/users");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../../utils/constans");

function getToken(headers) {
  console.log(headers.authorizationn)
  const [bearer, token] = headers?.authorizationn?.split(" ") || [];
  if (token && bearer.toLowerCase()==="bearer") return token;
  throw createHttpError.Unauthorized("please login first");
}
function VerifyAccessOrdinaryUserToken(req, res, next) {
  try {
    const token = getToken(req.headers);
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      try {
        if (err) throw createHttpError.Unauthorized("please login");
        const { mobile } = payload || {};
        const user = await UserModel.findOne(
          { mobile },
          { password: 0, otp: 0 }
        );
        if (!user) throw createHttpError.Unauthorized("please login");
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
function VerifyAccessAdminUserToken(req, res, next) {
  try {
    const token = getToken(req.headers);
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      try {
        if (err) throw createHttpError.Unauthorized("please login");
        const { mobile } = payload || {};
        const user = await UserModel.findOne(
          { mobile },
          { password: 0, otp: 0 }
        );
        if (!user) throw createHttpError.Unauthorized("please login");
        if(user.Role!=="ADMIN") throw createHttpError.Unauthorized("just admin can access")
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
  VerifyAccessOrdinaryUserToken,
  VerifyAccessAdminUserToken,
  getToken,
  VerifyAccessTokenInGraphQL
};