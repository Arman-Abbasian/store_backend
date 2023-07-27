const { AdminCategoryRoutes } = require("./admin/category.routes");
const { HomeRoutes } = require("./api/api.routes");
const { CategoryRoutes } = require("./category/category.routes");
const { DeveloperRoutes } = require("./developer/developer.routes");
const { UserRoutes } = require("./user/user.routes");
const router = require("express").Router();

//all routes related to api section
router.use("/", HomeRoutes)
//all routes related to user section
router.use("/user", UserRoutes)
//all routes related to category section
router.use("/category", CategoryRoutes)
//all routes related to developer section
router.use("/developer", DeveloperRoutes)
//all routes related to admin category section
router.use("/admin/category",AdminCategoryRoutes )


//all routes existed now in AllRoutes
module.exports = {
    AllRoutes : router
}