const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const { ProductModel } = require("../../../models/products");
const { idPublicValidation } = require("../../validators/public.validation");
const { Controller } = require("../controller");


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
      let products;
      if (search) {
        products = await ProductModel.find({
          $text: {
            $search: new RegExp(search, "ig")
          }
        })
      } else {
        products = await ProductModel.find({})
      }
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
  async findProductById(productID) {
    const { id } = await idPublicValidation.validateAsync({ id: productID });
    const product = await ProductModel.findById(id);
    if (!product) throw new createError.NotFound("محصولی یافت نشد")
    return product
  }
}

module.exports = {
  ProductController: new ProductController(),
};

