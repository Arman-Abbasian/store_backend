const { GraphQLString } = require("graphql");
const { ProductModel } = require("../../models/products");
const { ResponseType } = require("../typeDefs/public.types");
const {StatusCodes: HttpStatus} = require("http-status-codes");

const { CourseModel } = require("../../models/courses");
const { BlogModel } = require("../../models/blogs");
const { checkExistBlog, checkExistCourse, checkExistProduct } = require("../utils");
const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/user/user.middleware");

const DisLikeProduct = {
    type: ResponseType,
    args : {
        productID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        //authenticate the user
        const user = await VerifyAccessTokenInGraphQL(req)
        //get the productID from param
        const {productID} = args
        //chek if the productID is a true objectID und find the product in the product collection
        await checkExistProduct(productID)
        //check if the user liked the product before
        let likedproduct = await ProductModel.findOne({
            _id: productID,
            likes : user._id
        })
        //check if the user disliked the product before
        let disLikedproduct = await ProductModel.findOne({
            _id: productID,
            dislikes : user._id
        })
        //if the user disliked product before=> put away the dislike 
        //if the user did not dislike the product before =>dislike it
        const updateQuery = disLikedproduct? {$pull:{dislikes: user._id}} : {$push: {dislikes: user._id}}
        await ProductModel.updateOne({ _id: productID }, updateQuery)
        let message
        //if user did not like the product so=>now like it so...
        if(!disLikedproduct){
            if(likedproduct) await ProductModel.updateOne({ _id: productID }, {$pull: {likes: user._id}})
            message = "disliked successfully"
        } else message = "disliked cancel successfully"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const DisLikeCourse = {
    type: ResponseType,
    args : {
        courseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        let likedcourse = await CourseModel.findOne({
            _id: courseID,
            likes : user._id
        })
        let disLikedCourse = await CourseModel.findOne({
            _id: courseID,
            dislikes : user._id
        })
        const updateQuery = disLikedCourse? {$pull:{dislikes: user._id}} : {$push: {dislikes: user._id}}
        await CourseModel.updateOne({ _id: courseID }, updateQuery)
        let message;
        if(!disLikedCourse){
            if(likedcourse) await CourseModel.updateOne({ _id: courseID }, {$pull: {likes: user._id}})
            message = "course disliked successfully"
        } else message = "disliked course cancelled successfully"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const DisLikeBlog = {
    type: ResponseType,
    args : {
        blogID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {blogID} = args
        await checkExistBlog(blogID)
        let likedBlog = await BlogModel.findOne({
            _id: blogID,
            likes : user._id
        })
        let disLikedBlog = await BlogModel.findOne({
            _id: blogID,
            dislikes : user._id
        })
        const updateQuery = disLikedBlog? {$pull:{dislikes: user._id}} : {$push: {dislikes: user._id}}
        await BlogModel.updateOne({ _id: blogID }, updateQuery)
        let message
        if(!disLikedBlog){
            if(likedBlog)await BlogModel.updateOne({ _id: blogID }, {$pull: {likes: user._id}})
            message = "blog disliked successfully"
        } else message = "disliked blog cancelled"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
module.exports = {
    DisLikeProduct,
    DisLikeBlog,
    DisLikeCourse
}