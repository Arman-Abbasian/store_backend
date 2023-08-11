const path=require("path");
const fs=require("fs");

const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const { ProductModel } = require("../../../models/products");
const { ListOfImagesFromRequest, copyObject, setFeatures, deleteInvalidPropertyInObject, deleteImageFolder, stringToArrayFunction } = require("../../../utils/functions");
const { idPublicValidation } = require("../../validators/public.validation");
const { createProductSchema, editProductSchema } = require("../../validators/admin/product.validation");
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
      //get the param id of product
      const { id } = req.params;
      //check the validation of id and find the product in product collection
      const product = await this.findProductById(id)
      //"copyObject" function get a clone form object=> we clone from object to protect main data that client sent"
      const data = copyObject(req.body);
      //blackListFields is equals to ProductBlackList object
      const validatedData=await editProductSchema.validateAsync(data) 
      // console.log(validatedData)
      const { title, text, short_text, category,discount,colors,tags ,count, price, type } = validatedData;
    const supplier = req.user._id;
    //check the existance of category
    await this.findCategoryById(category);
    
    //gather weight, length, width, height in a object=>features
    let features = setFeatures(validatedData)  
      const updateProductResult = await ProductModel.updateOne({ _id: product._id }, { $set: validatedData })
      if (updateProductResult.modifiedCount == 0) throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "خطای داخلی" }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data : {
          message: "edited successfully"
        }
      })
    } catch (error) {
      next(error);
    }
  }
  async removeProductById(req, res, next) {
    try {
      //first get the id param from frontend
      const { id } = req.params;
      //then validate the id and find product based on the id
      const product = await this.findProductById(id);
      //find the folder name that images saved in that folder
      const imageLinkArray=(product.images?.[0])?.split("/")
      const foldername=imageLinkArray.at((imageLinkArray.length)-2);
      //then delete the product
      const removeProductResult = await ProductModel.deleteOne({ _id: product._id });
      //then check if the delete implemented or not
      if (removeProductResult.deletedCount == 0) throw createError.InternalServerError("could not removed");
      deleteImageFolder(foldername,"productImages")
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data : {
          message:"product deleted successfully"
        }
      })
    } catch (error) {
      next(error);
    }
  }
  async addOneImage(req, res, next) {
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
  async deleteOneImage(req, res, next) {
    try {
      //get the param id of product
      const { id } = req.params;
      //check the validation of id and find the product in product collection
      const product = await this.findProductById(id)
      //"copyObject" function get a clone form object=> we clone from object to protect main data that client sent"
      const data = copyObject(req.body);
      //blackListFields is equals to ProductBlackList object
      const validatedData=await editProductSchema.validateAsync(data) 
      //make a blacklist of forbidden fields to edit
      let blackListFields = Object.values(ProductBlackList);
      deleteInvalidPropertyInObject(validatedData, blackListFields)
      validatedData.features = setFeatures(validatedData)
      const updateProductResult = await ProductModel.updateOne({ _id: product._id }, { $set: validatedData })
      if (updateProductResult.modifiedCount == 0) throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "خطای داخلی" }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data : {
          message: "edited successfully"
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
    console.log(product)
    if (!product) throw new createError.NotFound("product not found")
    return product
  }
  //first validate the id then find the category based on id
  async findCategoryById(categoryId){
    const { id } = await idPublicValidation.validateAsync({ id:categoryId });
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

