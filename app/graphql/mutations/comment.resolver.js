const { GraphQLString } = require("graphql");
const createHttpError = require("http-errors");

const { BlogModel } = require("../../models/blogs");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { ResponseType } = require("../typeDefs/public.types");
const { copyObject } = require("../../utils/functions");
const { default: mongoose } = require("mongoose");
const { CourseModel } = require("../../models/courses");
const { ProductModel } = require("../../models/products");
const { checkExistCourse, checkExistProduct, checkExistBlog } = require("../utils");
const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/user/user.middleware");

const CreateCommentForBlog = {
    type: ResponseType,
    args : {
        comment: {type: GraphQLString},
        blogID: {type: GraphQLString},
        parent: {type: GraphQLString},
    },
    resolve : async (_, args, context) => {
        try {
            const {req} = context;
        //verify the user who want to register a comment
         const user = await VerifyAccessTokenInGraphQL(req)
         //get the args that client sent
        const {comment, blogID, parent} = args
        //based on the blogId check :1- id is a mongoID , 2- the blog is existed in the blog collection or not
        await checkExistBlog(blogID)
        //if the user sent a valid parentID
        if(parent && mongoose.isValidObjectId(parent)){
            //find the parent comment of this comment (if the user sent a parent field to us)
            const commentDocument = await findParentComment(BlogModel, parent)
            //if the comment was a answer comment (not a parent comment) so=> throw a error 
            if(commentDocument && !commentDocument?.openToComment) throw createHttpError.BadRequest("you can not answer to this comment")
            const createAnswerResult = await BlogModel.updateOne({
                _id: blogID,
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                         //openToComment is false because this is a answer comment
                        openToComment: false
                    }
                }
            });
            if(!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("server error")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "answer registered successfully"
                }
            }
            //if the comment do not have a parent field(client do not sent parent field or valid parent)
        }else{
            const createParentCommentResult = await BlogModel.updateOne({_id: blogID}, {
                $push : {comments : {
                    comment, 
                    user: user._id, 
                    show : false,
                    //openToComment is true because this is a parent comment
                    openToComment : true
                }}
            })
            if(!createParentCommentResult.modifiedCount) {
                throw createHttpError.InternalServerError("server error")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message:"comment registered successfully"
                }
            }
        }
        
        } catch (error) {
            throw createHttpError(error.message)
        }
    }
}
const CreateCommentForProduct = {
    type: ResponseType,
    args : {
        comment: {type: GraphQLString},
        productID: {type: GraphQLString},
        parent: {type: GraphQLString},
    },
    resolve : async (_, args, context) => {
       try {
        const {req} = context;
        //check the token of user
         const user = await VerifyAccessTokenInGraphQL(req)
         //get the params, queries, bodies and ... that client sent
        const {comment, productID, parent} = args
        //based on the blogId check :1- id is a mongoID , 2- the product is existed in the product collection or not
        await checkExistProduct(productID)
        if(parent && mongoose.isValidObjectId(parent)){
            //find the parent comment of this comment (if the user sent a parent field to us)
            const commentDocument = await findParentComment(ProductModel, parent)
            //if the comment was not a parent comment(openToComment:false)
            if(commentDocument && !commentDocument?.openToComment) throw createHttpError.BadRequest("you can not register answer for this comment")
            console.log("yesssssssss")
            const createAnswerResult = await ProductModel.updateOne({
                _id: productID,
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if(!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("server error")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "answer registered successfully"
                }
            }
        }else{
            const createParentCommentResult=await ProductModel.updateOne({_id: productID}, {
                $push : {comments : {
                    comment, 
                    user: user._id, 
                    show : false,
                    openToComment : true
                }}
            })
            if(!createParentCommentResult.modifiedCount) {
                throw createHttpError.InternalServerError("server error")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "comment registered successfully"
                }
            }
        }
       } catch (error) {
        console.log(error)
        throw createHttpError.BadRequest(error.message)
       }
        
    }
}
const CreateCommentForCourse = {
    type: ResponseType,
    args : {
        comment: {type: GraphQLString},
        courseID: {type: GraphQLString},
        parent: {type: GraphQLString},
    },
    resolve : async (_, args, context) => {
        const {req} = context;
         const user = await VerifyAccessTokenInGraphQL(req)
        const {comment, courseID, parent} = args
        if(!mongoose.isValidObjectId(courseID)) throw createHttpError.BadGateway("شناسه دوره ارسال شده صحیح نمیباشد")
        await checkExistCourse(courseID)
        if(parent && mongoose.isValidObjectId(parent)){
            //find the parent comment
            const parentCommentDocument = await findParentComment(CourseModel, parent)
            //if the comment was a answer comment (not a parent comment) so=> throw a error
            if(!parentCommentDocument?.openToComment) throw createHttpError.BadRequest("you can not register answer for this comment")
            const createAnswerResult = await CourseModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if(!createAnswerResult.matchedCount && !createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("ثبت پاسخ انجام نشد")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "پاسخ شما با موفقیت ثبت شد"
                }
            }
        }else{
            await CourseModel.updateOne({_id: courseID}, {
                $push : {comments : {
                    comment, 
                    user: user._id, 
                    show : false,
                    openToComment : true
                }}
            })
        }
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message: "ثبت نظر با موفقیت انجام شد پس از تایید در وبسایت قرار میگیرد"
            }
        }
    }
}
//find the parent comment
async function findParentComment(model, id){
    //get parent comment field of the blog
    const findedComment =  await model.findOne({"comments._id": id},  {"comments.$" : 1});
    //make a copy of comment field
    if(!findedComment?.comments?.[0]) throw createHttpError.NotFound("parent comment not found")
    return findedComment?.comments?.[0]
}
module.exports = {
    CreateCommentForBlog,
    CreateCommentForCourse,
    CreateCommentForProduct
}