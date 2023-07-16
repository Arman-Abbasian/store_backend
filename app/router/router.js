const { HomeRoutes } = require("./api");
const router = require("express").Router();

//all routes related to api section
router.use("/", HomeRoutes)
//all routes existed now in AllRoutes
module.exports = {
    AllRoutes : router
}