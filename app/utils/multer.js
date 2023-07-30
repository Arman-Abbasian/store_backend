const path = require("path");
const fs = require("fs");

const multer = require("multer");
const createError = require("http-errors");
//return of this function is directory of folder of uplad image in project"
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
  //add a property to req.body with the name =>fileUploadPath =>have the link address of blog image
  req.body.fileUploadPath = path.join("uploads", "blogs", folderName);
  //make the folder in project
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
const storage = multer.diskStorage({
  //destination is a directory in you project folders structure for save image
  destination: (req, file, cb) => {
    //if file was uploaded
    if (file?.originalname) {
      //create a directory in project for save file
      const filePath = createRoute(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  //filename is the name of the image
  filename: (req, file, cb) => {
    const fileName=req.body.title;
    //if file was uploaded
    if (file?.originalname) {
      //get the file extension(.png, .jpg, ...)
      const ext = path.extname(file.originalname);
      //make a name for file
      //add a property to req.body with the name =>filename =>have the  file name of blog image
      req.body.filename = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});
//check the format of image
function fileFilter(req, file, cb) {
  //check the existence of title =>i check it here, because i need it for the name of the folder
  if(!req.body.title) throw createError.BadRequest("the title of the file is required")
  //extension of image
  const ext = path.extname(file.originalname);
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
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
const uploadFile = multer({ storage:storage, fileFilter:fileFilter, limits: { fileSize: pictureMaxSize } }); 
const uploadVideo = multer({ storage:storage, videoFilter:videoFilter, limits: { fileSize: videoMaxSize } }); 
module.exports = {
  uploadFile,
  uploadVideo
};
