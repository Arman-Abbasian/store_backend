const { ChapterController } = require("../../../http/controllers/admin/course.controller/chapter.controller");

const router = require("express").Router();
router.put("/add", ChapterController.addChapter) //create new chapter
router.patch("/remove/:chapterID", ChapterController.removeChapterById) //create new chapter
router.patch("/update/:chapterID", ChapterController.updateChapterById) //create new chapter
module.exports = {
    AdminChapterRoutes : router
}