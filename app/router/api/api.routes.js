const {homeController} = require("../../http/controllers/api/api.controller");
const router = require("express").Router();

router.get("/", homeController.indexPage);

module.exports = {
    HomeRoutes : router
}