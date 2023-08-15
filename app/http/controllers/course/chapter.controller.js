const createHttpError = require("http-errors");
const { StatusCodes:  HttpStatus} = require("http-status-codes");



const { CourseModel } = require("../../../models/courses");
const { Controller } = require("../controller");
const { default: mongoose } = require("mongoose");

class ChapterController extends Controller{
    async chaptersOfCourse(req, res, next){
        try {
            const {courseID} = req.params; 
            const course = await this.getChapters(courseID)
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
    async getChapters(id){
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("param is not true");
        const chapters = await CourseModel.findOne({_id: id}, {chapters: 1, title: 1})
        if(!chapters) throw createHttpError.NotFound("course not found")
        return chapters
    }
    async getOneChapter(id){
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("param is not true");
        const chapter = await CourseModel.findOne({"chapters._id": id}, {"chapters.$" : 1})
        if(!chapter) throw new createHttpError.NotFound("chapter not found")
        return chapter
    }
}
module.exports = {
    ChapterController : new ChapterController()
}