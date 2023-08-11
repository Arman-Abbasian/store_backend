const path = require("path");
const fs = require("fs");

const multer = require("multer");
const createError = require("http-errors");
const { idPublicValidation } = require("../http/validators/public.validation");
const { ProductModel } = require("../models/products");

 //first validate the id then find the product based on id
 async function findProductById(productID) {
  const { id } = await idPublicValidation.validateAsync({ id: productID });
  const product = await ProductModel.findById(id);
  if (!product) throw new createError.NotFound("product not found")
  return product
}

//return of this function is directory of folder of upload image in project"
function createRoute(req) {
  //make a directory address
  console.log(req.body.foldername)
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "productImages",
    req.body.foldername
  );
  //add a property to req.body with the name =>fileUploadPath =>have the link address of blog image until folder(with out the name of file)
  req.body.fileUploadPath = path.join("uploads", "blogImages", req.body.foldername);
  //make the folder in project
  // fs.mkdirSync(directory, { recursive: true });
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) throw err;
  });
  return directory;
}
//make the direcory of file in projectStructure=>destination and name of the file=>fileName
const storage = multer.diskStorage({
  //destination is a directory in you project folders structure for save image
  destination: (req, file, cb) => {
    //if file was uploaded
    if (file?.originalname) {
      //create a directory in project for save file
      //and add a property to req.body with the name =>fileUploadPath that have the link address of image
      const filePath = createRoute(req);
      console.log(filePath)
      //file path is the directory of image in project structure
      return cb(null, filePath);
    }
    cb(null, null);
  },
  //filename is the name of the image
  filename: (req, file, cb) => {
    const filenamee=Date.now().toString();
    //if file was uploaded
    if (file?.originalname) {
      //get the file extension(.png, .jpg, ...)
      const ext = path.extname(file.originalname);
      //make a name for file
      //add a property to req.body with the name =>filename =>have the  file name of blog image
      const filename = filenamee+ext;
      req.body.filename=filename;
      //fileName is the name of the file
      return cb(null, filename);
    }
    cb(null, null);
  },
});
//check the format of image=>fileFilter is a middleware
async function fileFilter(req, file, cb) {
  const { id } = req.params;
     //check the validation of id and find the product in product collection
     const product = await findProductById(id);
     req.body.product=product;
     const productImageArray=product.images[0].split("/");
     //when split the image it should be 4 element otherwise that is false
     if(productImageArray.length !==4) throw createError.InternalServerError("server error")
     const foldername=productImageArray.at((productImageArray.length)-2);
    req.body.foldername=foldername
  //extension of image
  const ext = path.extname(file.originalname);
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  //check the format of file
  if (extensions.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("image format is not true"));
}
//check the format of video
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const extensions = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (extensions.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("video format is not true"));
}
const pictureMaxSize = 1 * 1000 * 1000;//1MB
const videoMaxSize = 300 * 1000 * 1000;//300MB
//first the fileFiler run then fileSize and then the storage section
const  uploadOneImageProduct = multer({ storage:storage, fileFilter:fileFilter, limits: { fileSize: pictureMaxSize } }); 
const uploadOneImageVideo = multer({ storage:storage, videoFilter:videoFilter, limits: { fileSize: videoMaxSize } }); 





module.exports = {
  uploadOneImageProduct,
  uploadOneImageVideo
};
