const createHttpError = require("http-errors");
const { idPublicValidation } = require("../../../validators/public.validation");
const { BlogModel } = require("../../../../models/blogs");

async function beforeEditBlogImage(req,res,next){
try {
    //find the title of blog
await idPublicValidation.validateAsync(req.params)
const {id}=req.params;
const {title}=await findBlog(id);
req.body.title=title;
next()
} catch (error) {
    next(error)
}
}
async function findBlog(id) {
    const blog = await BlogModel.findOne({_id:id}).populate([{path : "category", select : ['title']}, {path: "author", select : ['mobile', 'first_name', 'last_name', 'username']}]);
    if(!blog) throw createHttpError.BadRequest("blog not found");
    delete blog.category.children
    return blog
  }
  module.exports={
    beforeEditBlogImage
  }