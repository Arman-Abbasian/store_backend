const {UserController} = require("../../http/controllers/admin/user.controller");

const router = require("express").Router();
router.get("/list", UserController.getAllUsers)

module.exports = {
    AdminUserRoutes : router,
}