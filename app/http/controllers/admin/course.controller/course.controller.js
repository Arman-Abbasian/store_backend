const path = require("path");
const fs=require("fs")
const { default: mongoose } = require("mongoose");

const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");

const { CourseModel } = require("../../../../models/courses");
const { copyObject, deleteInvalidPropertyInObject, deleteFileInPublic, deleteImageFolder, deleteOneImageInFolder } = require("../../../../utils/functions");
const { createCourseSchema, editCourseSchema } = require("../../../validators/admin/course.validation/course.validation");
const { Controller } = require("../../controller");
const { CategoryModel } = require("../../../../models/categories");


class CourseController extends Controller{
    async addCourse(req, res, next){
        try {
            await createCourseSchema.validateAsync(req.body)
            let {title, short_text, text, tags, category, price, discount = 0, type, discountedPrice,image} = req.body;
            //teacher of the course is the one, that register the course
            const teacher = req.user._id
            await this.findCategoryById(category)
            //if type field is free so =>we can not implement price for course
            if(Number(price) > 0 && type === "free") throw createHttpError.BadRequest("free course does not have price")
            if(Number(discount) > 0 && type === "free") throw createHttpError.BadRequest("free course does not have discount")
            const course = await CourseModel.create({
                title, 
                short_text, 
                text, 
                tags, 
                category, 
                price, 
                discountedPrice,
                dicountStatus : false,
                discount, 
                type,
                image,
                teacher 
            })
            if(!course?._id) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message : "the course added successfully"
                }
            })
        } catch (error) {
            console.log(req.body.foldername)
           if(req.body?.foldername){
            deleteImageFolder(req.body.foldername,"courseImages")
           }
            next(error)
        }
    }
    async updateCourseById(req, res, next){
        try {
            //1- get the course id from client
            const {id} = req.params;
            //check the 1- mongoId being and 2- existance of course in course collection
            const course = await this.findCourseById(id)
            await editCourseSchema.validateAsync(req.body)
            //3- clone from client data body
            const data = copyObject(req.body);
            console.log(data)
            //make a list of forbidden fields to change
            let blackListFields = ["coursetotalTime","chaptertotalTime","chapters", "episodes", "students", "bookmarks", "likes", "dislikes", "comments", "category", "teacher"]
            const validData=deleteInvalidPropertyInObject(data, blackListFields)
            const updateCourseResult = await CourseModel.updateOne({_id: id}, {
                $set: validData
            })
            if(!updateCourseResult.modifiedCount) throw new createHttpError.InternalServerError("server error")
            //if the new file uploaded =>delete the previous file 
            if(req.file){
                deleteOneImageInFolder("courseImages",req.body.foldername,req.body.previousFilename) 
            }
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "course updated successfully"
                }
            })
        } catch (error) {
            if(req.body.newFilename){
                deleteOneImageInFolder("courseImages",req.body.foldername,req.body.newFilename)
            }
            next(error)
        }
    }
    async findCourseById(id){
        //check if the id is a mongoid
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("param is not true")
        //find the course in CourseModel
        const course = await CourseModel.findById(id);
        if(!course) throw createHttpError.NotFound("course is not existed");
        return course
    }
    async findCategoryById(id){
        if(!mongoose.isValidObjectId(id)) throw createHttpError.BadRequest("param is not true")
        const category = await CategoryModel.findById(id);
        if(!category) throw createHttpError.NotFound("category not found");
        return category
    }
    async changeCourseDiscountStatus(req, res, next) {
        try {
            const {id} = req.params;
            let {discountStatus} = req.body
            discountStatus = (discountStatus === "true")? true : false
            if(typeof discountStatus == "boolean") {
                const result = await CourseModel.updateOne({_id: id}, {$set: {discountStatus}});
                if(result.modifiedCount > 0){
                    return res.status(HttpStatus.OK).json({
                        statusCode: HttpStatus.OK,
                        data: {
                            message: discountStatus?  "وضعیت تخفیف ها فعال شد" : 'وضعیت تخفیف ها غیر فعال شد'
                        }
                    })
                }
                throw createHttpError.BadRequest("تغییر انجام نشد مجددا تلاش کنید") 
            }
            throw createHttpError.BadRequest("مقدار ارسال شده صحیح نمیباشد")
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    CourseController : new CourseController()
}