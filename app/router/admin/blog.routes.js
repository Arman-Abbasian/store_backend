const { AdminBlogController } = require("../../http/controllers/admin/blog.controller");
const { stringToArray } = require("../../http/middlewares/admin/stringToArray");
const { uploadFile } = require("../../utils/multer/multerCreateBlog");

const router = require("express").Router();
router.post("/add",uploadFile.single("image"), stringToArray("tags"), AdminBlogController.createBlog)
router.patch("/update/:id",uploadFile.single("image"), stringToArray("tags"), AdminBlogController.updateBlogById)
router.delete("/:id", AdminBlogController.deleteBlogById);



module.exports = {
    AdminBlogRoutes : router
}