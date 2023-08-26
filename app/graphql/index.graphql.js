const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { CreateCommentForBlog, CreateCommentForCourse, CreateCommentForProduct } = require("./mutations/comment.resolver");
const { LikeProduct, LikeBlog, LikeCourse } = require("./mutations/likes.resolver");
const { DisLikeProduct, DisLikeBlog, DisLikeCourse} = require("./mutations/dislikes.resolver");
const { BookmarkBlog, BookmarkCourse, BookmarkProduct} = require("./mutations/bookmarks.resolver");
const { AddCourseToBasket, AddProductToBasket, RemoveCourseFromBasket, RemoveProductFromBasket} = require("./mutations/basket.resolver");
const { BlogResolver } = require("./queries/blog.resolver");
const { CategoriesParentResolver, CategoryChildResolver } = require("./queries/category.resolver");
const { getUserBookmarkedBlogs, getUserBookmarkedCourses, getUserBookmarkedProducts, getUserBasket} = require("./queries/user-profile.resolver");
const { CourseResolver } = require("./queries/course.resolver");
const { ProductResolver } = require("./queries/product.resolver");
//query, mutation, schema, types
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields : {
         //get all blogs
        blogs : BlogResolver,
        //get all product
        products: ProductResolver,
        //category query have two section :1- get the all parent category, 2-get the children of one category
        categories : CategoriesParentResolver,
        childOfCategory : CategoryChildResolver,
        courses : CourseResolver,
        getUserBookmarkedBlogs,
        getUserBookmarkedCourses,
        getUserBookmarkedProducts,
        getUserBasket
    }
})
// GUD
const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        CreateCommentForBlog,
        CreateCommentForCourse,
        CreateCommentForProduct,
        LikeProduct,
        LikeCourse,
        LikeBlog,
        DisLikeProduct,
        DisLikeBlog,
        DisLikeCourse,
        BookmarkBlog,
        BookmarkCourse,
        BookmarkProduct,
        AddCourseToBasket,
        AddProductToBasket,
        RemoveCourseFromBasket,
        RemoveProductFromBasket
    }
})
//this schema for graph ql with the name(graphQLSchema) have to kinds of request
//1-some get request=>in query section
//2-some post, patch, put request=>in mutation section
const graphQLSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})
module.exports =  {
    graphQLSchema
}