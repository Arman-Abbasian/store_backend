const path = require("path");
const fs = require("fs");

const multer = require("multer");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { CourseModel } = require("../models/courses");

async function existCourseID(id){
  try {
    if(!mongoose.isValidObjectId(id)) throw createError.BadRequest("courseID is not valid")
    const course=await CourseModel.findOne({_id:id});
  if(!course) throw createError.BadRequest("course not existed")
  return course
  } catch (error) {
    throw createError.BadRequest(error.message)
  }
}
async function existChapterID(id){
  try {
    if(!mongoose.isValidObjectId(id)) throw createError.BadRequest("chapterID is not valid")
    const chapter=await CourseModel.findOne({"chapters._id":id});
  if(!chapter) throw createError.BadRequest("chapter not existed")
  return chapter
  } catch (error) {
    throw createError.BadRequest(error.message)
  }
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
    "episodeVideos",
    req.body.courseID,
    req.body.chapterID
  );
  //add a property to req.body with the name =>fileUploadPath =>have the link address of blog image until folder(with out the name of file)
  req.body.fileUploadPath = path.join("uploads", "episodeVideos", req.body.courseID,req.body.chapterID);
  //make the folder in project
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
      req.body.filename=filename;
      //fileName is the name of the file
      req.body.videoURL=(`${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${req.body.fileUploadPath}/${req.body.filename}`).replace(/\\/g, "/")
      return cb(null, filename);
    }
    cb(null, null);
  },
});

//check the format of video
async function fileFilter(req, file, cb) {
  console.log(req.body.courseID)
  if (!file.originalname) throw createError.BadRequest("any video uploaded")
  if(!req.body?.courseID || !req.body?.chapterID) throw createError.BadRequest("courseID or ChapterID not existed")
  await existCourseID(req.body.courseID)
  await existChapterID(req.body.chapterID)
  const ext = path.extname(file.originalname);
  const extensions = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (extensions.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("video format is not true"));
}
const videoMaxSize = 300 * 1000 * 1000;//300MB
//first the fileFiler run then fileSize and then the storage section
const uploadEpisodeVideo = multer({ storage:storage, fileFilter, limits: { fileSize: videoMaxSize } }); 
module.exports = {
  uploadEpisodeVideo
};
