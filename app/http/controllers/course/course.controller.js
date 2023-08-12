const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");

const { CourseModel } = require("../../../models/courses");
const { Controller } = require("../controller");

class CourseController extends Controller{
    async getListOfCourse(req, res, next){
        try {
            const {search} = req.query;
            let courses;
            
            if(search) courses = await CourseModel
            .find({$text : {$search : search}})
            .populate([
                {path: "category", select: {title: 1}},
                {path: "teacher", select: {first_name: 1, last_name:1, mobile:1, email: 1}}
            ])
            .sort({_id : -1})
            else courses = await CourseModel
            .find({})
            .populate([
                {path: "category", select: {children: 0, prent: 0}},
                {path: "teacher", select: {first_name: 1, last_name:1, mobile:1, email: 1}}
            ])
            .sort({_id : -1})
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
            const course = await CourseModel.findById(id) ;
            if(!course) throw createHttpError.NotFound("دوره ای یافت نشد")
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
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("شناسه ارسال شده صحیح نمیباشد")
        const course = await CourseModel.findById(id);
        if(!course) throw createHttpError.NotFound("دوره ای یافت نشد");
        return course
    }
}
module.exports = {
    CourseController : new CourseController()
}