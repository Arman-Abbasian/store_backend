const {Kind} = require("graphql");
const createHttpError = require("http-errors");
const { BlogModel } = require("../models/blogs");
const { CourseModel } = require("../models/courses");
const { ProductModel } = require("../models/products");
const { default: mongoose } = require("mongoose");

//this section run when the type is equals to object
function parseObject(valueNode) {
    //the under line means that=>const value={}
    const value = Object.create(null);
    //for each value of each key of the object
    valueNode.fields.forEach(field => {
        value[field.name.value] = parseValueNode(field.value)
    })
    return value
}
function parseValueNode(valueNode) {
    switch (valueNode.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return valueNode.value
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value)
        case Kind.OBJECT:
            return parseObject(valueNode.value)
        case Kind.LIST:
            //if the valueNode.value was Array=>for each element of the array run parseValueNode function
            return valueNode.values.map(parseValueNode)
        default:
            return null;
    }
}
function parseLiteral(valueNode){
    switch(valueNode.kind) {
        //if the type was string
        case Kind.STRING:
            return valueNode.value.charAt(0) === '{'? JSON.parse(valueNode.value): valueNode.value
            //if the type was integer of float
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value)
        case Kind.OBJECT:           
    }
}
//this function return a object
function toObject(value){
    if(typeof value === 'object'){
        return value
    }
    //this means the json object format => "{"ddd":"dsfsf","sffsf":"dsfsfsf"}"
    if(typeof value === "string" && value.charAt(0) === "{"){
        return JSON.parse(value)
    }
    return null
}
async function checkExistCourse(id){
    const course =  await CourseModel.findById(id);
    if(!course) throw createHttpError.NotFound("دوره ای با این مشخصات یافت نشد")
    return course
}
//based on the id check :1- id is a mongoID , 2- the blog is existed in the blog collection or not
async function checkExistProduct(id){
    if(!mongoose.isValidObjectId(id)) throw createHttpError.BadGateway("product param is not true")
    const product =  await ProductModel.findById(id);
    if(!product) throw createHttpError.NotFound("product not found")
    return product
}
//based on the id check :1- id is a mongoID , 2- the blog is existed in the blog collection or not
async function checkExistBlog(id){
    if(!mongoose.isValidObjectId(id)) throw createHttpError.BadGateway("blog param is not true")
    const blog =  await BlogModel.findById(id);
    if(!blog) throw createHttpError.NotFound("blog not found")
    return blog
}


module.exports = {
    toObject,
    parseLiteral,
    parseValueNode,
    parseObject,
    checkExistBlog,
    checkExistProduct,
    checkExistCourse
}