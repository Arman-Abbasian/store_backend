const {  VerifyAccessAdminUserToken, VerifyAccessOrdinaryUserToken} = require("../http/middlewares/user/user.middleware");
const { AdminBlogRoutes } = require("./admin/blog.routes");
const { AdminCategoryRoutes } = require("./admin/category.routes");
const { HomeRoutes } = require("./api/api.routes");
const { BlogRoutes } = require("./blog/blog.routes");
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
//all routes related to blog section
router.use("/blogs", BlogRoutes)
//all routes related to developer section
router.use("/developer",VerifyAccessOrdinaryUserToken, DeveloperRoutes)
//all routes related to admin category section
router.use("/admin/category",VerifyAccessAdminUserToken,AdminCategoryRoutes )
//all routes related to admin blog section
router.use("/admin/blog",VerifyAccessAdminUserToken,AdminBlogRoutes )


//all routes existed now in AllRoutes
module.exports = {
    AllRoutes : router
}