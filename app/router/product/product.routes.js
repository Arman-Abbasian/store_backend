const { ProductController } = require("../../http/controllers/product/product.controller");

const router = require("express").Router();
router.get("/list",ProductController.getAllProducts)
router.get("/:id", ProductController.getOneProduct)

module.exports = {
    ProductRoutes : router
}
