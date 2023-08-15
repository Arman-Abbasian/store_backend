const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");

const { CourseModel } = require("../../../models/courses");
const { Controller } = require("../controller");
const { filter } = require("../../../utils/functions");

class CourseController extends Controller{
    async getListOfCourse(req, res, next){
        try {
            const search = req?.query?.search || "";
            const category = req?.query?.category || "";
            const sort = req?.query?.sort || "";
            const courses=await filter(search,category,sort,CourseModel)
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    courses
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getCourseById(req, res, next){
        try {
            const {id} = req.params;
            const course = await this.findCourseById(id)
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    course
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async findCourseById(id){
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("param is not true");
        const course = await CourseModel.findById(id)
        .populate([
            {path: "category", select: {title: 1}},
            {path: "teacher", select: {first_name: 1, last_name:1, mobile:1, email: 1}}
        ]);
        if(!course) throw createHttpError.NotFound("course not found");
        return course
    }
}
module.exports = {
    CourseController : new CourseController()
}