const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/user/user.middleware");
const { BlogModel } = require("../../models/blogs");
const { CourseModel } = require("../../models/courses");
const { ProductModel } = require("../../models/products");
const { UserModel } = require("../../models/users");
const { BlogType } = require("../typeDefs/blog.type");
const { CourseType } = require("../typeDefs/course.type");
const { ProductType } = require("../typeDefs/product.type");
const { AnyType } = require("../typeDefs/public.types");
const {default: axios} = require("axios");
const { invoiceNumberGenerator, getBasketOfUser } = require("../../utils/functions");
const getUserBookmarkedBlogs = {
    type : new GraphQLList(BlogType),
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const blogs = await BlogModel.find({bookmarks : user._id}).populate([
            {path : 'author'}, 
            {path: "category"}, 
            {path: "comments.user"}, 
            {path: "comments.answers.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ]);
        return blogs
    }
}
const getUserBookmarkedProducts = {
    type : new GraphQLList(ProductType),
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const products = await ProductModel.find({bookmarks : user._id}).populate([
            {path : 'supplier'}, 
            {path: "category"},
            {path: "comments.user"},
            {path: "comments.answers.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ]);
        return products
    }
}
const getUserBookmarkedCourses = {
    type : new GraphQLList(CourseType),
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const courses = await CourseModel.find({bookmarks : user._id}).populate([
            {path : 'teacher'}, 
            {path: "category"},
            {path: "comments.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ]);
        return courses
    }
}
//in graphql like the restfull API we do not have the middlewares and have to do all checks, validations,
//search in db and ... in resolve section completely

//this quetry get the badket of user and make some changes on it and add some field to it
const getUserBasket = {
    type : AnyType,
    resolve : async (_, args, context) => {
        const {req} = context;
        // authenticate the user
        const user = await VerifyAccessTokenInGraphQL(req)
        const userDetail = await getBasketOfUser(user._id)
        return userDetail
    }
}

module.exports = {
    getUserBookmarkedBlogs,
    getUserBookmarkedCourses,
    getUserBookmarkedProducts,
    getUserBasket
}