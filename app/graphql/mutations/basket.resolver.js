const { GraphQLString, GraphQLInt } = require("graphql");
const { ProductModel } = require("../../models/products");
const { ResponseType } = require("../typeDefs/public.types");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/user/user.middleware");
const { CourseModel } = require("../../models/courses");
const { checkExistCourse, checkExistProduct } = require("../utils");
const { UserModel } = require("../../models/users");
const { copyObject } = require("../../utils/functions");
const createHttpError = require("http-errors");
const AddProductToBasket = {
    type: ResponseType,
    args : {
        productID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        //authenticate the user with their token in header=> req.header
        const user = await VerifyAccessTokenInGraphQL(req)
        //get the productID in params
        const {productID} = args
        //check 1- if the product id is a valid mongoID , 2- existance of product in product collection
        await checkExistProduct(productID)
        //check if the product existed in basket before or not
        const product = await findProductInBasket(user._id, productID)
        let message;
        //if product existed befor in basket =>add one to it's count
        if(product){
           const addOneProduct= await UserModel.updateOne(
                {
                _id: user._id,
                "basket.products.productID" : productID
                },
                {   
                    $inc: {
                        "basket.products.$.count": 1
                    }
                }
            )
            if (!addOneProduct.modifiedCount) throw createHttpError.InternalServerError("server error")
            message="one product added"
            //if product not existed before in basket =>add product to basket
        }else{
          const addProductToBasket=  await UserModel.updateOne(
                {
                _id: user._id
                },
                {   
                    $push: {
                        "basket.products": {
                            productID,
                            count: 1
                        }
                    }
                }
            )
            if (!addProductToBasket.modifiedCount) throw createHttpError.InternalServerError("server error")
            message="product added to basket"
        }
        return {
            statusCode: HttpStatus.OK,
            data: {
                message
            }
        }
    }
}
const AddCourseToBasket = {
    type: ResponseType,
    args : {
        courseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        const course = await findCourseInBasket(user._id, courseID)
        if(course){
            throw createHttpError.BadRequest("این دوره قبلا به سبد خرید اضافه شده")
        }else{
            await UserModel.updateOne(
                {
                _id: user._id
                },
                {   
                    $push: {
                        "basket.courses": {
                            courseID,
                            count: 1
                        }
                    }
                }
            )
        }
        return {
            statusCode: HttpStatus.OK,
            data: {
                message: "دوره به سبد خرید افزوده شد"
            }
        }
    }
}
const RemoveProductFromBasket = {
    type: ResponseType,
    args : {
        productID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        //authenticate the user with user token in header
        const user = await VerifyAccessTokenInGraphQL(req)
        //get the productID from client in param
        const {productID} = args
        //check if the productID is a valid mongoID and if the product existed in the product collection or not
        await checkExistProduct(productID)
        //check if the product existed before in the basket or not
        const product = await findProductInBasket(user._id, productID)
        let message;
        if(!product) throw createHttpError.NotFound("product not existed in the basket")
        //if the count for product in basket was bigger than one => reduce count 1
        if(product.count > 1){
           const reduceOneFromProductCount= await UserModel.updateOne(
                {
                _id: user._id,
                "basket.products.productID" : productID
                },
                {   
                    $inc: {
                        "basket.products.$.count": -1
                    }
                }
            )
            if(!reduceOneFromProductCount.modifiedCount) throw createHttpError.InternalServerError("server error")
            message = "product reduce 1"
        //if the number of the product in basket was 1 => remove the product form basket
        }else{
           const removedProductFromBasket= await UserModel.updateOne(
                {
                    _id: user._id,
                    "basket.products.productID" : productID
                },
                {   
                    $pull: {
                        "basket.products": {
                            productID,
                        }
                    }
                }
                )
                if(!removedProductFromBasket.modifiedCount) throw createHttpError.InternalServerError("server error")
                message = "product removed from basket"
        }
        return {
            statusCode: HttpStatus.OK,
            data: {
                message
            }
        }
    }
}
const RemoveCourseFromBasket = {
    type: ResponseType,
    args : {
        courseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {courseID} = args
        await checkExistCourse(courseID)
        const userCourse = await UserModel.findOne({_id: user._id, Courses: courseID})
        if(userCourse) throw new createHttpError.BadRequest("شما این دوره رو قبلا خریداری کردید")
        const course = await findCourseInBasket(user._id, courseID)
        if(!course) throw createHttpError.NotFound("دوره مورد نظزر در داخل سبد خرید یافت نشد")
        if(course.count > 1){
            await UserModel.updateOne(
                {
                _id: user._id,
                "basket.courses.courseID" : courseID
                },
                {   
                    $inc: {
                        "basket.courses.$.count": -1
                    }
                }
            )
            message = "یک عدد از دوره داخل سبد خرید کم شد"
        }else{
            await UserModel.updateOne(
                {
                _id: user._id,
                "basket.courses.courseID" : courseID
                },
                {   
                    $pull: {
                        "basket.courses": {
                            courseID,
                        }
                    }
                }
            )
            message = "دوره در داخل سبد خرید حذف شد"
        }
        return {
            statusCode: HttpStatus.OK,
            data: {
                message
            }
        }
    }
}
//this function return the product if that was before in the basket=> {
//      productID: '64d29431903cfcac3e131a57',
//      count: 2,
//    }
async function findProductInBasket(userID, productID){
    const findResult = await UserModel.findOne({_id: userID, "basket.products.productID": productID}, {"basket.products.$": 1})
    const userDetail = copyObject(findResult);
    console.log(userDetail?.basket)
    return userDetail?.basket?.products?.[0]
}
async function findCourseInBasket(userID, courseID){
    const findResult = await UserModel.findOne({_id: userID, "basket.courses.courseID": courseID}, {"basket.courses.$": 1})
    const userDetail = copyObject(findResult);
    return userDetail?.basket?.courses?.[0]
}
module.exports = {
    AddCourseToBasket,
    AddProductToBasket,
    RemoveCourseFromBasket,
    RemoveProductFromBasket
}