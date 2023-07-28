const path = require("path");

const { StatusCodes:HttpStatus} = require("http-status-codes")
const createError = require("http-errors");

const { UserModel } = require("../../../models/users");
const { BlogModel } = require("../../../models/blogs");
const { createBlogSchema } = require("../../validators/admin/blog.validation");
const { deleteFileInPublic } = require("../../../utils/functions");
const { Controller } = require("../controller");


class BlogController extends Controller {
    async getOneBlogById(req, res, next){
        try {
            const {id} = req.params;
            const blog = await this.findBlog(id);
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    blog
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getListOfBlogs(req, res, next){
        try {

            const blogs = await BlogModel.aggregate([
                {$match : {}},
                {
                    $lookup : {
                        from : "users",
                        foreignField : "_id",
                        localField : "author",
                        as : "author"
                    }
                },
                {
                    $unwind : "$author"
                },
                {
                    $lookup : {
                        from : "categories",
                        foreignField : "_id",
                        localField : "category",
                        as : "category"
                    }
                },
                {
                    $unwind : "$category"
                },
                {
                    $project : {
                        "author.__v" :0,
                        "category.__v" :0,
                        "author.otp" : 0,
                        "author.Roles" : 0,
                        "author.discount" : 0,
                        "author.bills" : 0,
                    }
                }
            ])
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data:{
                    blogs
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getCommetsOfBlog(req, res, next){
        try {
            
        } catch (error) {
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
    BlogController : new BlogController()
}