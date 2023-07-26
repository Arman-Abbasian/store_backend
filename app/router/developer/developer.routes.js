const { DeveloperController } = require("../../http/controllers/developer/developer.controller");


const router = require("express").Router();
router.get("/hash-password/:password", DeveloperController.hashPassword)
router.get("/random-number", DeveloperController.randomNumber)


module.exports = {
    DeveloperRoutes : router
}