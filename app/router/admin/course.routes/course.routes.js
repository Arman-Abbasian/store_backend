const { CourseController } = require("../../../http/controllers/admin/course.controller/course.controller");
const { stringToArray } = require("../../../http/middlewares/admin/stringToArray");
const { uploadCourseImage } = require("../../../utils/multerCreateCourse");
const { editCourseImage } = require("../../../utils/multerEditCourse");


const router = require("express").Router();
router.post("/add", uploadCourseImage.single("image"), stringToArray("tags"),CourseController.addCourse)
router.patch("/update/:id",editCourseImage.single("image"),stringToArray("tags"), CourseController.updateCourseById) // edit a course
router.patch("/change-discount-status/:id", CourseController.changeCourseDiscountStatus) // edit a course

module.exports = {
    AdminCourseRoutes : router
}