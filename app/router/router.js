const { HomeRoutes } = require("./api/api.routes");
const { UserRoutes } = require("./user/user.routes");
const router = require("express").Router();

//all routes related to api section
router.use("/", HomeRoutes)
//all routes related to user section
router.use("/user", UserRoutes)
//all routes existed now in AllRoutes
module.exports = {
    AllRoutes : router
}