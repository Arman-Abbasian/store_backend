const createHttpError = require("http-errors");
const { CourseController } = require("./course.controller");
const { StatusCodes:  HttpStatus} = require("http-status-codes");
const { deleteInvalidPropertyInObject } = require("../../../../utils/functions");
const { CourseModel } = require("../../../../models/courses");
const { Controller } = require("../../controller");
const { editChapterSchema, createChapterSchema } = require("../../../validators/admin/course.validation/chapter.validation");
const { default: mongoose } = require("mongoose");

class ChapterController extends Controller{
    async addChapter(req, res, next){
        try {
            await createChapterSchema.validateAsync(req.body)
            //here the id of the course sent by body(not params)
            const {id, title, text} = req.body;
            //findCourseById is a method of another calss =>so use it like under
            await CourseController.findCourseById(id)
            //$push is used for add a item in array in mongoDB
            //$pull is used for remove a item in array in mongoDB
            //and $set is for update a item in array in mongoDB
            const saveChapterResult = await CourseModel.updateOne({_id : id}, {
                $push : {
                chapters : {
                    title, text, episodes : []
                }
            }})
            if(saveChapterResult.modifiedCount == 0) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message : "chapter added successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removeChapterById(req, res, next){
        try {
            const {chapterID} = req.params
            //check if the chapter existed or not and if existed return that chapter
            await this.getOneChapter(chapterID);
            const removeChapterResult = await CourseModel.updateOne({"chapters._id": chapterID}, {
                $pull : {
                    chapters : {
                        _id : chapterID
                    }
                }
            })
            if(removeChapterResult.modifiedCount == 0) throw new createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message: "chapter deleted successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateChapterById(req, res, next){
        try {
            const {chapterID} = req.params;
            //check if the chapter existed or not and if existed return that chapter
            await this.getOneChapter(chapterID);
            const data = req.body;
            await editChapterSchema.validateAsync(data)
            const validatedData=deleteInvalidPropertyInObject(data, ["_id"])
            console.log(validatedData)
            const updateChapterResult = await CourseModel.updateOne(
                {"chapters._id" : chapterID}, 
                //in $set method the new data replace the old data(with the same name) 
                //and the under fields remain
                {'$set' : { "chapters.$" : validatedData }}
            )
            if(updateChapterResult.modifiedCount == 0) 
                throw new createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "chapter edited successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    //this method is for find a chapter in array of chapters in a course
    async getOneChapter(id){
        //here instead of find a course by id find a chapter(we have array of chapters in a course document)
        //by id
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("param is not true")
        const chapter = await CourseModel.findOne({"chapters._id": id}, {"chapters.$" : 1})
        if(!chapter) throw new createHttpError.NotFound("chapter no found")
        return chapter
    }
}
module.exports = {
    ChapterController : new ChapterController()
}