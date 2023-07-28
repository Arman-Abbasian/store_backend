const { BlogController } = require("../../http/controllers/blogs/blog.controller");

const router = require("express").Router();
router.get("/", BlogController.getListOfBlogs)
router.get("/:id", BlogController.getOneBlogById);

module.exports = {
    BlogRoutes : router
}