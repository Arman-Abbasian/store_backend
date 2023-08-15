const { ChapterController } = require("../../http/controllers/course/chapter.controller");

const router = require("express").Router();
router.get("/list/:courseID", ChapterController.chaptersOfCourse) //create new chapter
module.exports = {
   ChapterRoutes : router
}
