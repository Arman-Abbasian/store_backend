const { GraphQLString } = require("graphql");
const { ProductModel } = require("../../models/products");
const { ResponseType } = require("../typeDefs/public.types");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/user/user.middleware");
const { CourseModel } = require("../../models/courses");
const { BlogModel } = require("../../models/blogs");
const { checkExistBlog, checkExistCourse, checkExistProduct } = require("../utils");

const BookmarkProduct = {
    type: ResponseType,
    args : {
        productID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        //authenticate the user
        const user = await VerifyAccessTokenInGraphQL(req)
        //get the product id from param
        const {productID} = args
        //check if the productID is a mongoID and find the product in product collection
        await checkExistProduct(productID)
        //check if the user bookmarked the product before
        let BookmarkedProduct = await ProductModel.findOne({
            _id: productID,
            bookmarks : user._id
        })
        //if the user bookmarked the product before=>remove the bookmark and if not =>bookmark the product
        const updateQuery = BookmarkedProduct? {$pull:{bookmarks: user._id}} : {$push: {bookmarks: user._id}}
        await ProductModel.updateOne({ _id: productID }, updateQuery)
        let message
        if(!BookmarkedProduct){ 
            message = "product bookmarked"
        } else message = "bookmarked product removed"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const BookmarkCourse = {
    type: ResponseType,
    args : {
        courseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        let bookmarkedcourse = await CourseModel.findOne({
            _id: courseID,
            bookmarks : user._id
        })
        const updateQuery = bookmarkedcourse? {$pull:{bookmarks: user._id}} : {$push: {bookmarks: user._id}}
        await CourseModel.updateOne({ _id: courseID }, updateQuery)
        let message;
        if(!bookmarkedcourse){
            message = "course bookmarked"
        } else message = "bookmarked course removed"
        return {
            statusCode: HttpStatus.OK,
            data : {
                message
            }
        }
    }
}
const BookmarkBlog = {
    type: ResponseType,
    args : {
        blogID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {blogID} = args
        await checkExistBlog(blogID)
        let bookmarkedBlog = await BlogModel.findOne({
            _id: blogID,
            bookmarks : user._id
        })
        const updateQuery = bookmarkedBlog? {$pull:{bookmarks: user._id}} : {$push: {bookmarks: user._id}}
        await BlogModel.updateOne({ _id: blogID }, updateQuery)
        let message
        if(!bookmarkedBlog){
            message = "blog bookmarked"
        } else message = "bookmarked blog removed"
        return {
            statusCode: HttpStatus.OK,
            data : {
                message
            }
        }
    }
}
module.exports = {
    BookmarkBlog,
    BookmarkCourse,
    BookmarkProduct
}