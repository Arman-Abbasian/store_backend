const { ProductController } = require("../../http/controllers/admin/product.controller");
const { foldername } = require("../../http/middlewares/admin/product/foldername");
const { stringToArray } = require("../../http/middlewares/admin/stringToArray");
const { uploadFile } = require("../../utils/multerCreateProduct");

const router = require("express").Router();
router.post("/add", stringToArray("tags", "colors"),ProductController.addProduct)
router.delete("/remove/:id", ProductController.removeProductById)
 router.patch("/edit/:id", uploadFile.array("images", 10), stringToArray("tags", "colors"),ProductController.editProduct)

// router.patch()
// router.get()
module.exports = {
    AdminProductRoutes : router
}
