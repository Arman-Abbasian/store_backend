const path = require("path");

const { StatusCodes:HttpStatus} = require("http-status-codes")
const createError = require("http-errors");

const { CategoryModel } = require("../../../models/categories");
const { createBlogSchema } = require("../../validators/admin/blog.validation");
const { Controller } = require("../controller");
const { BlogModel } = require("../../../models/blogs");
const { deleteFileInPublic } = require("../../../utils/functions");

class AdminBlogController extends Controller {
    async createBlog(req, res, next){
        try {
            //add a new property to req.body with=> stick link of image to name of image and make a complete link
            req.body.image =path.join(req.body.fileUploadPath, req.body.filename)
            req.body.image = req.body.image.replace(/\\/g, "/")
            await createBlogSchema.validateAsync(req.body);
            const {title, text, short_text, category, tags} = req.body;
            const image =  req.body.image
            //author field is the user is sign in
            const author = req.user._id 
            //check if the client blog title is unique
            const repititieTitle=await BlogModel.findOne({title})
            if(repititieTitle) throw createError.BadRequest("the title existed in DB");
            //check if the category is existed in categories collection
            const categoryExistence= await CategoryModel.findOne({_id:category});
            if(!categoryExistence) throw createError.BadRequest("category is not existed in DB")
            const blog = await BlogModel.create({title,image, text, short_text, category, tags, author})
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message : "blog created successfully"
                }
            })
        } catch (error) {
            console.log(req.body.image)
            //if occur a error in process of upload image and image saved=>this function, delete the saved image
            //we should put this fuction in this section in all controllers that in them a file saved
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
            //the fields that is not allowed change by client=>some field in model not made by client
            let blackListFields = ["bookmarks", "dislikes", "comments", "likes", "author","title"]
            Object.keys(data).forEach(key => {
                //if a client field is equal any name with in the blacklist=>delete that field
                if(blackListFields.includes(key)) delete data[key];
                //if a value of client fields is in nullishData array=>delete it
                if(nullishData.includes(data[key])) delete data[key];
                //trim the string value of fields
                if(typeof data[key] == "string") data[key] = data[key].trim();
                //trim the string value of every element of array fields and delete the empty fields
                if(Array.isArray(data[key]) && data[key].length > 0 ) {
                    data[key] = data[key].map(item => item.trim())
                    data[key]=data[key].filter(item=>!nullishData.includes(item)) 
                }
            })
            const updateResult = await BlogModel.updateOne({_id : id}, {$set : data})
            if(updateResult.modifiedCount == 0) throw createError.InternalServerError("data could not updated")

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message : "data is updated successfully"
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