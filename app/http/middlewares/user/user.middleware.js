const createError = require("http-errors");
const { UserModel } = require("../../../models/users");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../../utils/constans");

//check just =>exsitance of a bearer token
function getToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || [];
  if (token && bearer.toLowerCase()==="bearer") return token;
  throw createError.Unauthorized("please login first");
}
//veriry the access token and find user and add a property to req=>req.user
function VerifyAccessToken(req, res, next) {
  try {
    const token = getToken(req.headers);
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      try {
        if (err) throw createError.Unauthorized("please login");
        const { mobile } = payload || {};
        const user = await UserModel.findOne(
          { mobile },
          { password: 0, otp: 0 }
        );
        if (!user) throw createError.Unauthorized("please login");
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
    if (!user) throw new createError.Unauthorized("حساب کاربری یافت نشد");
    return user
  } catch (error) {
    throw new createError.Unauthorized()
  }
}
//authorized each route
function permission(roles=[]){
  let role=[];
  return function (req,res,next){
try {
  let permission=false;
if (typeof roles==="string"){
  role.push(roles)
  role.forEach(role=>{
    console.log(req.user)
    if(req.user.Role.includes(role)) {
      permission=true;
    }
  })
}else{
  roles.forEach(role=>{
    if(req.user.Role.includes(role)) {
      permission=true;
    }
  })
}

if (!permission) throw createError.Forbidden("you can not access to this section")
next()
} catch (error) {
  next (error)
}
  }
}
module.exports = {
  VerifyAccessToken,
  getToken,
  VerifyAccessTokenInGraphQL,
  permission
};