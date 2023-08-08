const path=require("path");
const fs=require("fs");

const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const { ProductModel } = require("../../../models/products");
const { deleteFileInPublic, ListOfImagesFromRequest, copyObject, setFeatures, deleteInvalidPropertyInObject, deleteImageFolder, stringToArrayFunction } = require("../../../utils/functions");
const { idPublicValidation } = require("../../validators/public.validation");
const { createProductSchema } = require("../../validators/admin/product.validation");
const { Controller } = require("../controller");
const { CategoryModel } = require("../../../models/categories");
const { uploadFile } = require("../../../utils/multerCreateProduct");
const multer = require("multer");
const { stringToArray } = require("../../middlewares/admin/stringToArray");

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
  async addProduct(req, res, next) {
    //make a foldername to put some images in it
    const foldername=Date.now().toString();
    try {
       //multer section
       function createRoute(req) {
        const directory = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "public",
          "uploads",
          "productImages",
          foldername
        );
        //req.body.fileUploadPath  is the link of the image until folder not file
        req.body.fileUploadPath = path.join("uploads", "productImages", foldername);
        //make the directory in project
        fs.mkdirSync(directory, { recursive: true });
        return directory;
      }
      //third here run=>directory and name of the file in your project
      const storage = multer.diskStorage({
        //make the directory for store the image
        destination: (req, file, cb) => {
          if (file?.originalname) {
            const filePath = createRoute(req);
            return cb(null, filePath);
          }
          cb(null, null);
        },
        filename: (req, file, cb) => {
          if (file?.originalname) {
            const ext = path.extname(file.originalname);
            const fileName = String(Date.now().toString() + ext);
            req.body.filename = fileName;
            return cb(null, fileName);
          }
          cb(null, null);
        },
      });
      //first here run=>format of the file
      function fileFilter(req, file, cb) {
        //add foldername to body for later use
        if(file?.originalname){
          const ext = path.extname(file.originalname);
          //accepted format
        const mimetypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
        if (mimetypes.includes(ext)) {
          return cb(null, true);
        }
        return cb(createError.BadRequest("image format is not true"));
        }
      }
      //second here run=>size of the file
      const pictureMaxSize = 1 * 1000 * 1000;//300MB
      const upload = multer({ storage, fileFilter, limits: { fileSize: pictureMaxSize } })
     .array("images",5)
      upload(req, res, async function (err) {
       try {
        if (err) {
          throw createError.BadRequest ("Error uploading images");
      }else{
        async function ee(){
        const images =await ListOfImagesFromRequest(req?.files || [], req.body.fileUploadPath)
        //change string to array function
        req.body.colors=stringToArrayFunction(req.body.colors);
        //change string to array function
        req.body.tags=stringToArrayFunction(req.body.tags);
        const productBody =await  createProductSchema.validateAsync(req.body);
        const { title, text, short_text, category,discount,colors,tags ,count, price, type } = productBody;
    const supplier = req.user._id;
    //check the existance of category
    console.log(category)
    const { id } = await idPublicValidation.validateAsync({ id:category });
    console.log(id)
    const categoryExistance = await CategoryModel.aggregate([
      {
        $match: { _id: id },
      },
    ]);
    if (!categoryExistance) throw new createError.NotFound("category not found")
    //gather weight, length, width, height in a object=>features
    let features = setFeatures(productBody)
    const product =await  ProductModel.create({
      title,
      text,
      short_text,
      category,
      tags,
      count,
      price,
      discount,
      images,
      features,
      supplier,
      type,
      colors
    })
    
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "product add successfully"
      }
    });
        }
        await ee()
      }
       } catch (error) {
        deleteImageFolder(foldername,"productImages")
      next(error);
       }
    });
      //list of images link
      
  } catch (error) {
      deleteImageFolder(foldername,"productImages")
      next(error);
    }
  }
  async editProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id)
      const data = copyObject(req.body);
      data.images = ListOfImagesFromRequest(req?.files || [], req.body.fileUploadPath);
      data.features = setFeatures(req.body)
      let blackListFields = Object.values(ProductBlackList);
      deleteInvalidPropertyInObject(data, blackListFields)
      const updateProductResult = await ProductModel.updateOne({ _id: product._id }, { $set: data })
      if (updateProductResult.modifiedCount == 0) throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "خطای داخلی" }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data : {
          message: "به روز رسانی باموفقیت انجام شد"
        }
      })
    } catch (error) {
      next(error);
    }
  }
  async removeProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      const removeProductResult = await ProductModel.deleteOne({ _id: product._id });
      if (removeProductResult.deletedCount == 0) throw createError.InternalServerError();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data : {
          message: "حذف محصول با موفقیت انجام شد"
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
  async findCategoryById(categoryId){
    const { id } = await idPublicValidation.validateAsync({ categoryId });
    const category = await CategoryModel.aggregate([
      {
        $match: { _id: id },
      },
    ]);
    if (!category) throw new createError.NotFound("category not found")
    return category
  }
}

module.exports = {
  ProductController: new ProductController(),
};

