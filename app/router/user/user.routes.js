const { UserController } = require("../../http/controllers/user/user.controller");

const router = require("express").Router();
router.post("/get-otp", UserController.getOtp)
router.post("/check-otp", UserController.checkOtp)
router.post("/refresh-token", UserController.refreshToken)

module.exports = {
    UserRoutes : router
}