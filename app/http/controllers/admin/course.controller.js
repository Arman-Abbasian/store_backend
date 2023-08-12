const path = require("path");
const { default: mongoose } = require("mongoose");

const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");

const { CourseModel } = require("../../../models/courses");
const { copyObject, deleteInvalidPropertyInObject, deleteFileInPublic } = require("../../../utils/functions");
const { createCourseSchema } = require("../../validators/admin/course.validation");
const { Controller } = require("../controller");


class CourseController extends Controller{
    async addCourse(req, res, next){
        try {
            await createCourseSchema.validateAsync(req.body)
            const {fileUploadPath, filename} = req.body;
            const image = path.join(fileUploadPath, filename).replace(/\\/g, "/")
            let {title, short_text, text, tags, category, price, discount = 0, type, discountedPrice} = req.body;
            const teacher = req.user._id
            if(Number(price) > 0 && type === "free") throw createHttpError.BadRequest("برای دوره ی رایگان نمیتوان قیمت ثبت کرد")
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
                status: "notStarted",
                teacher 
            })
            if(!course?._id) throw createHttpError.InternalServerError("دوره ثبت نشر=د")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message : "دوره با موفقیت ایجاد شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateCourseById(req, res, next){
        try {
            const {id} = req.params;
            const course = await this.findCourseById(id)
            const data = copyObject(req.body);
            const {filename, fileUploadPath} = req.body;
            let blackListFields = ["time", "chapters", "episodes", "students", "bookmarks", "likes", "dislikes", "comments", "fileUploadPath", "filename"]
            deleteInvalidPropertyInObject(data, blackListFields)
            if(req.file){
                data.image = path.join(fileUploadPath, filename)
                deleteFileInPublic(course.image)
            }
            const updateCourseResult = await CourseModel.updateOne({_id: id}, {
                $set: data
            })
            if(!updateCourseResult.modifiedCount) throw new createHttpError.InternalServerError("به روزرسانی دوره انجام نشد")

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "به روزرسانی دوره با موفقیت انجام شد"
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