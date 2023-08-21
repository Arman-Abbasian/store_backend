const { UserController } = require("../../http/controllers/user/user.controller");
const { permissionGuard } = require("../../http/middlewares/user/permission.guard");
const { VerifyAccessToken } = require("../../http/middlewares/user/user.middleware");

const router = require("express").Router();
router.post("/get-otp", UserController.getOtp)
router.post("/check-otp", UserController.checkOtp)
router.post("/refresh-token", UserController.refreshToken)
router.patch("/update-profile",VerifyAccessToken, UserController.updateUserProfile)
router.get("/profile",VerifyAccessToken,permissionGuard("get user profile"),UserController.userProfile)
module.exports = {
    UserRoutes : router
}