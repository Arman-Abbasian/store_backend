const { CategoryController } = require("../../http/controllers/admin/category.controller");
const router = require("express").Router();

// make a new category
 router.post("/add", CategoryController.addCategory)
//delete one category
router.delete("/remove/:id", CategoryController.removeCategory)
//change the title of a category
router.patch("/update/:id", CategoryController.editCategoryTitle)


module.exports = {
    AdminCategoryRoutes : router
}