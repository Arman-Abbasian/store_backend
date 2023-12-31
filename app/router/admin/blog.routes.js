const { AdminBlogController } = require("../../http/controllers/admin/blog.controller");
const { stringToArray } = require("../../http/middlewares/admin/stringToArray");
const { editBlogImage } = require("../../utils/multerEditBlog");
const { createBlogImage } = require("../../utils/multerCreateBlog");
const { beforeEditBlogImage } = require("../../http/middlewares/admin/blog/beforeEditBlogImage");

const router = require("express").Router();
router.post("/add",createBlogImage.single("image"), stringToArray("tags"), AdminBlogController.createBlog)
router.patch("/update/:id",beforeEditBlogImage,editBlogImage.single("image"), stringToArray("tags"), AdminBlogController.updateBlogById)
router.delete("/:id", AdminBlogController.deleteBlogById);



module.exports = {
    AdminBlogRoutes : router
}