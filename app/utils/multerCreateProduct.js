const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");



const foldername=Date.now().toString();

function createRoute(req) {
  console.log(4)
  req.body.foldername=foldername;
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "productImages",
    req.body.foldername
  );
  //req.body.fileUploadPath  is the link of the image until folder not file
  req.body.fileUploadPath = path.join("uploads", "products", req.body.foldername);
  //make the directory in project
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
//third here run=>directory and name of the file in your project
const storage = multer.diskStorage({
  //make the directory for store the image
  destination: (req, file, cb) => {
    console.log(3)
    if (file?.originalname) {
      const filePath = createRoute(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    console.log(5)
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
  console.log(req.body)
  console.log(2)
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
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("فرمت ارسال شده ویدیو صحیح نمیباشد"));
}
//second here run=>size of the file
const pictureMaxSize = 1 * 1000 * 1000;//300MB
const videoMaxSize = 300 * 1000 * 1000;//300MB
const uploadFile = multer({ storage, fileFilter, limits: { fileSize: pictureMaxSize } }); 
const uploadVideo = multer({ storage, videoFilter, limits: { fileSize: videoMaxSize } }); 
module.exports = {
  uploadFile,
  uploadVideo
};
