const { GraphQLString } = require("graphql");
const { ProductModel } = require("../../models/products");
const { ResponseType } = require("../typeDefs/public.types");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/user/user.middleware");
const { CourseModel } = require("../../models/courses");
const { BlogModel } = require("../../models/blogs");
const { checkExistBlog, checkExistCourse, checkExistProduct } = require("../utils");

const LikeProduct = {
    type: ResponseType,
    args : {
        productID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        //check if the user is authenticate
        const user = await VerifyAccessTokenInGraphQL(req)
        //get the productID from param
        const {productID} = args
        //check the id authentication and find the product based on the id
        await checkExistProduct(productID)
        console.log(user._id)
        //check if the product liked before by the or not
        let likedproduct = await ProductModel.findOne({
            _id: productID,
            likes : user._id
        })
        //check if the product disliked before by the or not
        //(because a product can not be liked an disliked by one user so=>we should check like an dislike both)
        let disLikedproduct = await ProductModel.findOne({
            _id: productID,
            dislike : user._id
        })
        console.log(!!likedproduct)
        console.log(!!disLikedproduct)
        //if the user liked product befoer=> put away the like 
        //if the user did not like the product before =>like it
        const updateQuery = likedproduct? {$pull:{likes: user._id}} : {$push: {likes: user._id}}
        await ProductModel.updateOne({ _id: productID }, updateQuery)
        //when you want to make a conditional message like under=>use a message variable
        let message
        //if user did not like the product so=>now like it so...
        if(!likedproduct){
            //if the user (that now like the product), disliked this product befor => remove the dislike
            //because a product can not liked and disliked simuoltenously by on user
            if(disLikedproduct) await ProductModel.updateOne({ _id: productID }, {$pull: {dislikes: user._id}})
            message = "product liked"
        } else message = "cancel liked product"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const LikeCourse = {
    type: ResponseType,
    args : {
        courseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        //check if the user is authenticated
        const user = await VerifyAccessTokenInGraphQL(req)
        // get the courseID from param
        const {courseID} = args
        //check that courseID is a authenticate mongoID and find the course in the course collection
        await checkExistCourse(courseID)
        //check if the user liked the course before or not
        let likedcourse = await CourseModel.findOne({
            _id: courseID,
            likes : user._id
        })
        //check if the user liked the course before or not
        //(because a user can not like and dislike a course simoultenously=>we have to check both)
        let disLikedCourse = await CourseModel.findOne({
            _id: courseID,
            dislike : user._id
        })
        console.log(!!likedcourse)
        console.log(!!disLikedCourse)
        //if the user liked the course before=>remove the like // otherweise=> put the like
        const updateQuery = likedcourse? {$pull:{likes: user._id}} : {$push: {likes: user._id}}
        await CourseModel.updateOne({ _id: courseID }, updateQuery)
        let message;
        //if the user now liked the course so... 
        if(!likedcourse){
            //if the user liked the course now and disliked it before => so remove the provious dislike
            if(disLikedCourse) await CourseModel.updateOne({ _id: courseID }, {$pull: {dislikes: user._id}})
            message = "course liked successfully"
        } else message = "liked course canceled succussfully"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const LikeBlog = {
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
            dislike : user._id
        })
        const updateQuery = likedBlog? {$pull:{likes: user._id}} : {$push: {likes: user._id}}
        await BlogModel.updateOne({ _id: blogID }, updateQuery)
        let message
        if(!likedBlog){
            if(disLikedBlog) await BlogModel.updateOne({ _id: blogID }, {$pull: {dislikes: user._id}})
            message = "blogs liked successfully"
        } else message = "liked blog cancelled"
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
module.exports = {
    LikeProduct,
    LikeBlog,
    LikeCourse
}