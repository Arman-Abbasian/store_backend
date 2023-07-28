const path = require("path");

const { StatusCodes:HttpStatus} = require("http-status-codes")
const createError = require("http-errors");

const { UserModel } = require("../../../models/users");
const { createBlogSchema } = require("../../validators/admin/blog.validation");
const { Controller } = require("../controller");
const { BlogModel } = require("../../../models/blogs");
const { deleteFileInPublic } = require("../../../utils/functions");

class AdminBlogController extends Controller {
    async createBlog(req, res, next){
        try {
            const blogDataBody = await createBlogSchema.validateAsync(req.body);
            req.body.image =path.join(blogDataBody.fileUploadPath, blogDataBody.filename)
            req.body.image = req.body.image.replace(/\\/g, "/")
            const {title, text, short_text, category, tags} = blogDataBody;
            const image =  req.body.image
            const author = req.user._id 
            const blog = await BlogModel.create({title,image, text, short_text, category, tags, author})
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message : "ایجاد بلاگ با موفقیت انجام شد"
                }
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }
    async deleteBlogById(req, res, next){
        try {
            const {id} = req.params;
            await this.findBlog(id);
            const result = await BlogModel.deleteOne({_id : id});
            if(result.deletedCount == 0) throw createError.InternalServerError("حذف انجام نشد");
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : "حذف مقاله با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateBlogById(req, res, next){
        try {
            const {id} = req.params;
            await this.findBlog(id);
            if(req?.body?.fileUploadPath &&  req?.body?.filename){
                req.body.image = path.join(req.body.fileUploadPath, req.body.filename)
                req.body.image = req.body.image.replace(/\\/g, "/")
            }
            const data = req.body;
            let nullishData = ["", " ", "0", 0, null, undefined]
            let blackListFields = ["bookmarks", "deslikes", "comments", "likes", "author"]
            Object.keys(data).forEach(key => {
                if(blackListFields.includes(key)) delete data[key]
                if(typeof data[key] == "string") data[key] = data[key].trim();
                if(Array.isArray(data[key]) && data[key].length > 0 ) data[key] = data[key].map(item => item.trim()) 
                if(nullishData.includes(data[key])) delete data[key];
            })
            const updateResult = await BlogModel.updateOne({_id : id}, {$set : data})
            if(updateResult.modifiedCount == 0) throw createError.InternalServerError("به روز رسانی انجام نشد")

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message : "به روز رسانی بلاگ با موفقیت انجام شد"
                }
            })
        } catch (error) {
            deleteFileInPublic(req?.body?.image)
            next(error)
        }
    }
    async findBlog(id) {
        const blog = await BlogModel.findById(id).populate([{path : "category", select : ['title']}, {path: "author", select : ['mobile', 'first_name', 'last_name', 'username']}]);
        if(!blog) throw createError.NotFound("مقاله ای یافت نشد");
        delete blog.category.children
        return blog
    }
}

module.exports = {
    AdminBlogController : new AdminBlogController()
}