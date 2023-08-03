const path = require("path");
const fs = require("fs");

const multer = require("multer");
const createError = require("http-errors");
const { BlogModel } = require("../models/blogs");
const { idPublicValidation } = require("../http/validators/public.validation");
const createHttpError = require("http-errors");
//return of this function is directory of folder of upload image in project"

async function findBlog(id) {
  const blog = await BlogModel.findOne({_id:id}).populate([{path : "category", select : ['title']}, {path: "author", select : ['mobile', 'first_name', 'last_name', 'username']}]);
  if(!blog) throw createHttpError.BadRequest("blog not found");
  delete blog.category.children
  return blog
}
function createRoute(req) {
  const folderName=req.body.title;
  //make a directory address
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "blogImages",
    folderName
  );
  //add a property to req.body with the name =>fileUploadPath =>have the link address of blog image until folder(with out the name of file)
  req.body.fileUploadPath = path.join("uploads", "blogImages", folderName);
  //make the folder in project
  fs.mkdirSync(directory, { recursive: true });
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
      //file path is the directory of image in project structure
      return cb(null, filePath);
    }
    cb(null, null);
  },
  //filename is the name of the image
  filename: (req, file, cb) => {
    const fileNamee=req.body.title;
    //if file was uploaded
    if (file?.originalname) {
      //get the file extension(.png, .jpg, ...)
      const ext = path.extname(file.originalname);
      //make a name for file
      //add a property to req.body with the name =>filename =>have the  file name of blog image
      const filename = fileNamee+ext;
      req.body.filename=filename;
      //fileName is the name of the file
      return cb(null, filename);
    }
    cb(null, null);
  },
});
//check the format of image=>fileFilter is a middleware
async function fileFilter(req, file, cb) {
  console.log(req.body.title)
const {id}=req.params;
const {title}=await findBlog(id);
  req.body.title=title;
  //if image sent by client
  if(file?.originalname){
  //extension of image
  const ext = path.extname(file.originalname);
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  //check the format of file
  if (extensions.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("image format is not true"));
  }
  
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
const editBlogImage = multer({ storage:storage, fileFilter:fileFilter, limits: { fileSize: pictureMaxSize } }); 
const editBlogVideo = multer({ storage:storage, videoFilter:videoFilter, limits: { fileSize: videoMaxSize } }); 
module.exports = {
  editBlogImage,
  editBlogVideo
};
