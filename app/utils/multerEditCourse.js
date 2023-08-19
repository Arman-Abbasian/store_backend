const path = require("path");
const fs = require("fs");

const multer = require("multer");
const createError = require("http-errors");
const { CourseModel } = require("../models/courses");
const { default: mongoose } = require("mongoose");

async function findCourseById(id){
  //check if the id is a mongoid
  if(!mongoose.isValidObjectId(id)) throw createError.BadRequest("param is not true")
  //find the course in CourseModel
  const course = await CourseModel.findById(id);
  if(!course) throw createError.NotFound("course is not existed");
  return course
}

//return of this function is directory of folder of upload image in project"
function createRoute(req) {
  //make a directory address
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "courseImages",
    req.body.foldername
  );
  //add a property to req.body with the name =>fileUploadPath =>have the link address of blog image until folder(with out the name of file)
  req.body.fileUploadPath = path.join("uploads", "courseImages", req.body.foldername);
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
      //file path is the directory of image in project structure
      return cb(null, filePath);
    }
    cb(null, null);
  },
  //filename is the name of the image
  filename: (req, file, cb) => {
    const fileName=Date.now().toString();
    //if file was uploaded
    if (file?.originalname) {
      //get the file extension(.png, .jpg, ...)
      const ext = path.extname(file.originalname);
      //make a name for file
      //add a property to req.body with the name =>filename =>have the  file name of blog image
      const filename = fileName+ext;
      req.body.newFilename=filename;
      req.body.image=path.join(req.body.fileUploadPath, filename ).replace(/\\/g, "/")
      req.body.imageURL=`${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${req.body.image}`
      //fileName is the name of the file
      return cb(null, filename);
    }
    cb(null, null);
  },
});
//check the format of image=>fileFilter is a middleware
async function fileFilter(req, file, cb) {
  if(file?.originalname){
    const {id}=req.params;
    const {imageURL}=await findCourseById(id);
    const imageURLArray=imageURL.split("/");
    req.body.foldername=imageURLArray.at((imageURLArray.length)-2);
    req.body.previousFilename=imageURLArray.at((imageURLArray.length)-1);
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
const  editCourseImage = multer({ storage:storage, fileFilter:fileFilter, limits: { fileSize: pictureMaxSize } }); 
const editCourseVideo = multer({ storage:storage, videoFilter:videoFilter, limits: { fileSize: videoMaxSize } }); 





module.exports = {
  editCourseImage,
  editCourseVideo
};
