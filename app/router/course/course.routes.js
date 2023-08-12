const router = require("express").Router();

const { CourseController } = require("../../http/controllers/course/course.controller");

router.get("/list", CourseController.getListOfCourse) //get all course
router.get("/:id", CourseController.getCourseById) //get all course

module.exports = {
    CourseRoutes : router
}
