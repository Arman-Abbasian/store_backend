const { CategoryController } = require("../../http/controllers/categories/category.controller");


const router = require("express").Router();

// get all main parent (whose their parent's field is undefined)
router.get("/parents", CategoryController.getAllParents)
//get all children of a specific parent
router.get("/children/:id", CategoryController.getchildOfParents)
//get all cateories
router.get("/all", CategoryController.getAllCategory)
//get all cateories with defining childeren level (graphlookup)
router.get("/list-of-all", CategoryController.getAllCategoryWithoutPopulate)
//get one category with it's children
router.get("/:id", CategoryController.getCategoryById)


module.exports = {
    CategoryRoutes : router
}