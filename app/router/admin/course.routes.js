const { CourseController } = require("../../http/controllers/admin/course.controller");
const { stringToArray } = require("../../http/middlewares/admin/stringToArray");
const { uploadCourseImage } = require("../../utils/multerCreateCourse");


const router = require("express").Router();
router.post("/add", uploadCourseImage.single("image"), stringToArray("tags"),CourseController.addCourse)
//router.patch("/update/:id",uploadCourseImage.single("image"), CourseController.updateCourseById) // edit a course
router.patch("/change-discount-status/:id", CourseController.changeCourseDiscountStatus) // edit a course

module.exports = {
    AdminCourseRoutes : router
}