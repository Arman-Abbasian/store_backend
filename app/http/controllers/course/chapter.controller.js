const createHttpError = require("http-errors");
const { StatusCodes:  HttpStatus} = require("http-status-codes");



const { CourseModel } = require("../../../models/courses");
const { Controller } = require("../controller");

class ChapterController extends Controller{
    async chaptersOfCourse(req, res, next){
        try {
            const {courseID} = req.params;
            
            const course = await this.getChaptersOfCourse(courseID)
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
    async getChaptersOfCourse(id){
        const chapters = await CourseModel.findOne({_id: id}, {chapters: 1, title: 1})
        if(!chapters) throw createHttpError.NotFound("دوره ای با این شناسه یافت نشد")
        return chapters
    }
    async getOneChapter(id){
        const chapter = await CourseModel.findOne({"chapters._id": id}, {"chapters.$" : 1})
        if(!chapter) throw new createHttpError.NotFound("فصلی با این شناسه یافت نشد")
        return chapter
    }
}
module.exports = {
    ChapterController : new ChapterController()
}