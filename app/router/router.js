const { VerifyAccessToken, permission } = require("../http/middlewares/user/user.middleware");
const { AdminBlogRoutes } = require("./admin/blog.routes");
const { AdminCategoryRoutes } = require("./admin/category.routes");
const courseRoutes = require("./admin/course.routes");
const { AdminCourseRoutes } = require("./admin/course.routes");
const { AdminProductRoutes } = require("./admin/product.routes");
const { HomeRoutes } = require("./api/api.routes");
const { BlogRoutes } = require("./blog/blog.routes");
const { CategoryRoutes } = require("./category/category.routes");
const { CourseRoutes } = require("./course/course.routes");
const { DeveloperRoutes } = require("./developer/developer.routes");
const { ProductRoutes } = require("./product/product.routes");
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
//all routes related to product section
router.use("/products", ProductRoutes)
//all routes related to course section
/router.use("/courses", CourseRoutes)
//all routes related to developer section
router.use("/developer",VerifyAccessToken, DeveloperRoutes)
//all routes related to admin category section
router.use("/admin/category",VerifyAccessToken,permission(["ADMIN",,"WRITER"]),AdminCategoryRoutes )
//all routes related to admin blog section
router.use("/admin/blog",VerifyAccessToken,permission(["ADMIN","WRITER"]),AdminBlogRoutes )
//all routes related to admin product section
router.use("/admin/product",VerifyAccessToken,permission(["ADMIN","WRITER"]),AdminProductRoutes )
//all routes related to admin course section
router.use("/admin/course",VerifyAccessToken,permission(["ADMIN","WRITER"]),AdminCourseRoutes )


//all routes existed now in AllRoutes
module.exports = {
    AllRoutes : router
}