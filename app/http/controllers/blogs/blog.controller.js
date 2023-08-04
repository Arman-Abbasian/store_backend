const path = require("path");

const { StatusCodes:HttpStatus} = require("http-status-codes")
const createError = require("http-errors");

const { UserModel } = require("../../../models/users");
const { BlogModel } = require("../../../models/blogs");
const { createBlogSchema } = require("../../validators/admin/blog.validation");
const { deleteFileInPublic } = require("../../../utils/functions");
const { Controller } = require("../controller");
const { idPublicValidation } = require("../../validators/public.validation");


class BlogController extends Controller {
    async getOneBlogById(req, res, next){
        try {
            await idPublicValidation.validateAsync(req.params)
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
                //find all blogs
                {
                    $match : 
                    {}
                },
                //instead of value of autor field that is id=>put data of that author firn user collection
                {
                    $lookup : 
                    {
                        from : "users",
                        foreignField : "_id",
                        localField : "author",
                        as : "author"
                    }
                },
                //lookup in base make array of object but we want object only so...
                {
                    $unwind : "$author"
                },
                //instead of value of category field that is id=>put data of that category firn catagory collection
                {
                    $lookup :
                     {
                        from : "categories",
                        foreignField : "_id",
                        localField : "category",
                        as : "category"
                    }
                },
                //lookup in base make array of object but we want object only so...
                {
                    $unwind : "$category"
                },
                {
                    $project : 
                    {
                        "author.__v" :0,
                        "category.__v" :0,
                        "author.otp" : 0,
                        "author.Role" : 0,
                        "author.discount" : 0,
                        "author.bills" : 0,
                        "author.Courses": 0,
                        "author.Products": 0,
                        "author.createdAt": 0,
                        "author.updatedAt": 0,
                        "author.refreshToken":0,
                        "author.mobile":0,
                    },
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
        //after find the blog by id, we have to field with mongoId value=>category and author, instead of mongoId value put the 
        //value of them in their collections(du give the ref collection in blogschema in this two fields)
        const blog = await BlogModel.findById(id).populate([{path : "category", select : ['_id','title']}, {path: "author", select : ['first_name', 'last_name', 'username']}]);
        if(!blog) throw createError.NotFound("blog not found");
        return blog
    }
}

module.exports = {
    BlogController : new BlogController()
}