const { CategoryController } = require("../../http/controllers/categories/category.controller");


const router = require("express").Router();

// get all main parent (whose their parent's field is undefined)
router.get("/parents", CategoryController.getAllParents)
//get all children of a specific parent
router.get("/children/:id", CategoryController.getchildOfParents)
// router.get("/all", CategoryController.getAllCategory)
// router.delete("/remove/:id", CategoryController.removeCategory)
//  router.get("/list-of-all", CategoryController.getAllCategoryWithoutPopulate)
// router.get("/:id", CategoryController.getCategoryById)
// router.patch("/update/:id", CategoryController.editCategoryTitle)


module.exports = {
    CategoryRoutes : router
}