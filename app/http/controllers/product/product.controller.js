const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const { ProductModel } = require("../../../models/products");
const { idPublicValidation } = require("../../validators/public.validation");
const { Controller } = require("../controller");
const { CategoryModel } = require("../../../models/categories");
const { filter } = require("../../../utils/functions");


const ProductBlackList = {
  BOOKMARKS: "bookmarks",
  LIKES: "likes",
  DISLIKES: "dislikes",
  COMMENTS: "comments",
  SUPPLIER: "supplier",
  WEIGHT: "weight",
  WIDTH: "width",
  LENGTH: "length",
  HEIGHT: "height",
  COLORS: "colors"
}
Object.freeze(ProductBlackList)

class ProductController extends Controller {
  async getAllProducts(req, res, next) {
    try {
      const search = req?.query?.search || "";
      const category = req?.query?.category || "";
      const sort = req?.query?.sort || "";
      const products=await filter(search,category,sort,ProductModel)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          products
        }
      })
    } catch (error) {
      next(error);
    }
  }
  async getOneProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data : {
          product
        }
      })
    } catch (error) {
      next(error);
    }
  }
  //first validate the id then find the product based on id
  async findProductById(productID) {
    const { id } = await idPublicValidation.validateAsync({ id: productID });
    const product = await ProductModel.findById(id);
    if (!product) throw new createError.NotFound("product not found")
    return product
  }
   //first validate the id then find the category based on id
   async findCategoryById(categoryID) {
    const { id } = await idPublicValidation.validateAsync({ id: categoryID });
    const category = await CategoryModel.findById(id);
    if (!category) throw new createError.BadRequest("category not found")
    return category
  }
}

module.exports = {
  ProductController: new ProductController(),
};

