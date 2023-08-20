const { VerifyAccessToken, permission } = require("../http/middlewares/user/user.middleware");
const { AdminRBACPermissionRoutes } = require("./admin/RBAC.routes/permission.routes");
const { AdminRBACRoleRoutes } = require("./admin/RBAC.routes/role.routes");
const { AdminBlogRoutes } = require("./admin/blog.routes");
const { AdminCategoryRoutes } = require("./admin/category.routes");
const { AdminChapterRoutes } = require("./admin/course.routes/chapter.routes");
const { AdminCourseRoutes } = require("./admin/course.routes/course.routes");
const { AdminEpisodeRoutes } = require("./admin/course.routes/episode.routes");
const { AdminProductRoutes } = require("./admin/product.routes");
const { AdminUserRoutes } = require("./admin/user.routes");
const { HomeRoutes } = require("./api/api.routes");
const { BlogRoutes } = require("./blog/blog.routes");
const { CategoryRoutes } = require("./category/category.routes");
const { ChapterRoutes } = require("./course/chapter.routes");
const { CourseRoutes } = require("./course/course.routes");
const {episodeRoutes} = require("./course/episode.routes");
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
//all routes related to course chapters section
/router.use("/course/chapters", ChapterRoutes)
//all routes related to course chapter episodes section
/router.use("/course/chapter/episodes", episodeRoutes)
//all routes related to developer section
router.use("/developer",VerifyAccessToken, DeveloperRoutes)
//all routes related to RBAC role
router.use("/admin/RBAC/role",VerifyAccessToken,permission(["ADMIN","WRITER"]),AdminRBACRoleRoutes)
//all routes related to RBAC permission
router.use("/admin/RBAC/permission",VerifyAccessToken,permission(["ADMIN","WRITER"]),AdminRBACPermissionRoutes)
//all routes related to admin user section
router.use("/admin/user",VerifyAccessToken,permission(["ADMIN","WRITER"]),AdminUserRoutes )
//all routes related to admin category section
router.use("/admin/category",VerifyAccessToken,permission(["ADMIN",,"WRITER"]),AdminCategoryRoutes )
//all routes related to admin category section
router.use("/admin/category/chapter",VerifyAccessToken,permission(["ADMIN",,"WRITER"]),AdminChapterRoutes )
//all routes related to course chapter episodes section
/router.use("/admin/course/chapter/episode", VerifyAccessToken,permission(["ADMIN",,"WRITER"]),AdminEpisodeRoutes)
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