const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const { UserModel } = require("../models/users")
const fs = require("fs");
const path = require("path");
const fsExtra = require('fs-extra');
const moment = require("moment-jalali");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constans");
const { idPublicValidation } = require("../http/validators/public.validation");
const { CategoryModel } = require("../models/categories");


//make a 5 digit number
function RandomNumberGenerator() {
    return Math.floor((Math.random() * 90000) + 10000)
}
//produce access token(get userId as input and return the access token)
function SignAccessToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile: user.mobile
        };
        const options = {
            expiresIn: "1d"
        };
        //produce a access token
        JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
            if (err) reject(createError.InternalServerError("server error"));
            resolve(token)
        })
    })
}
//produce refresh token(get userId as input and return the refresh token)
function SignRefreshToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile: user.mobile
        };
        const options = {
            expiresIn: "1y"
        };
        //produce a refresh token
        JWT.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, async (err, token) => {
            if (err) reject(createError.InternalServerError("server error"));
            resolve(token)
        })
    })
}
//verify the refresh token(get token as input and return the user)
function VerifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
        console.log(REFRESH_TOKEN_SECRET_KEY)
        JWT.verify(token,REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
            if (err) reject(createError.Unauthorized(err))
            const { mobile } = payload || {};
            console.log(mobile)
            const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
            if (!user) reject(createError.Unauthorized("please enter your account"))
            if (user.refreshToken!==token) reject(createError.Unauthorized("please enter your account"))
            resolve(user);
        })
    })
}
//if occur a error in process of upload image and image saved=>this function, delete the saved image
function deleteFileInPublic(fileAddress) {
    if (fileAddress) {
        const folderAdressArray=fileAddress.split("/")
        //delete the last section of address=>filename
       folderAdressArray.splice(folderAdressArray.length-1);
       //stick againg all the address to gether =>now we have folder address of the file
       const folderAddress=folderAdressArray.join("/");
        //directory of saved image file
        const pathFile = path.join(__dirname, "..", "..", "public", fileAddress)
        //directory of saved image folder
        const pathFolder = path.join(__dirname, "..", "..", "public", folderAddress)
        //if the directory is existed, delete the directory
        if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile)
        fs.rmdirSync(pathFolder)
    }
    }
}
//if occur a error in process of upload image and image saved=>this function, delete the saved image
function deleteImageFolder(foldername,mainFoldername) {
    if (foldername) {
        //directory of saved image file
        const pathFolder = path.join(__dirname, "..", "..", "public","uploads",mainFoldername, foldername)
        console.log(pathFolder)
        //directory of saved image folder
        if (fs.existsSync(pathFolder)) {
            fsExtra.emptyDirSync(pathFolder);
            fs.rmdirSync(pathFolder)
    }
    }
}
//delete just one file in a folder
function deleteOneImageInFolder(mainFoldername,foldername,filename="10") {
    if (foldername) {
        //directory of saved image file
        const pathFile = path.join(__dirname, "..", "..", "public","uploads",mainFoldername, foldername,filename)
        console.log(pathFile)
        //directory of saved image folder
        if (fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile)
    }
    }
}
//delete just one file in a folder
function deleteOneImageInNestedTwoLevelFolder(mainFoldername,foldername1,foldername2,filename="10") {
    if (foldername1 && foldername2) {
        //directory of saved image file
        const pathFile = path.join(__dirname, "..", "..", "public","uploads",mainFoldername, foldername1,foldername2,filename)
        //directory of saved image folder
        if (fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile)
    }
    }
}
//make the array of uploaded file's link 
function ListOfImagesFromRequest(files, fileUploadPath) {
    if (files?.length > 0) {
        return ((files.map(file => path.join(fileUploadPath, file.filename))).map(item => item.replace(/\\/g, "/")))
    } else {
        return []
    }
}
function setFeatures(body) {
    const { width, weight, height, length } = body;
    let features = {};
    if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
        if (!width) features.width = 0;
        else features.width = +width;
        if (!height) features.height = 0;
        else features.height = +height;
        if (!weight) features.weight = 0;
        else features.weight = +weight;
        if (!length) features.length = 0;
        else features.length = +length;
    }
    return features
}
//delete the client fields that have invalid value or is a forbidden filed to change
function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
    let nullishData = [null, undefined,NaN,," ",""]
    let nullishArrayElement = [null, undefined,NaN," ",""]
    //consider each field value of each client field
    Object.keys(data).forEach(key => {
        //if field key was equals to one the blackListFields
        if (blackListFields.includes(key)) delete data[key]
        //if the field value was in nullish data array=>remove field
        if (nullishData.includes(data[key])) delete data[key];
        //if the value of field was string=>trim the empty gap
        if (typeof data[key] == "string") data[key] = data[key].trim();
        //if the field was an array and length of array was at least one=>trim the empty gap of each element
        if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
        //if the field was an array and length of array was at least one=>delete the empty element
        if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].filter(item => !nullishArrayElement.includes(item))
    })
    return data;
}
function copyObject(object) {
    return JSON.parse(JSON.stringify(object))
}
function getTime(seconds) {
    let total = Math.round(seconds) / 60;
    let [minutes, percent] = String(total).split(".");
    let second = Math.round((percent * 60) / 100).toString().substring(0, 2);
    let houre = 0;
    if (minutes > 60) {
        total = minutes / 60
         let [h1, percent] = String(total).split(".");
         houre = h1,
         minutes = Math.round((percent * 60) / 100).toString().substring(0, 2);
    }
    if(String(houre).length ==1) houre = `0${houre}`
    if(String(minutes).length ==1) minutes = `0${minutes}`
    if(String(second).length ==1) second = `0${second}`
    
    return (houre + ":" + minutes + ":" +second)
}
function getTimeOfCourse(chapters = []){
    let time, hour, minute, second = 0;
    for (const chapter of chapters) {
        if(Array.isArray(chapter?.episodes)){
            for (const episode of chapter.episodes) {
                if(episode?.time) time = episode.time.split(":") // [hour, min, second]
                else time = "00:00:00".split(":")
                //if the format of time was 00:00:00
                if(time.length == 3){//13:05:23
                    second += Number(time[0]) * 3600 // convert hour to second
                    second += Number(time[1]) * 60 // convert minute to second
                    second += Number(time[2]) //sum second with seond
                    //if the format of time was 00:00
                }else if(time.length == 2){ //05:23
                    second += Number(time[0]) * 60 // convert minute to second
                    second += Number(time[1]) //sum second with seond
                }else{
                    second = Number(time)
                }
            }
        }
    }
    hour = Math.floor(second / 3600); //convert second to hour
    minute = Math.floor(second / 60) % 60; //convert second to minutes
    second = Math.floor(second % 60); //convert seconds to second
    //if the hour was single digit =>convert it to two digit=>9=>09
    if(String(hour).length ==1) hour = `0${hour}`
    if(String(minute).length ==1) minute = `0${minute}`
    if(String(second).length ==1) second = `0${second}`
    return (hour + ":" + minute + ":" +second) 
}
function getTimeOfChapter(chapter = []){
    let time, hour, minute, second = 0;
        if(Array.isArray(chapter?.episodes)){
            for (const episode of chapter.episodes) {
                if(episode?.time) time = episode.time.split(":") // [hour, min, second]
                else time = "00:00:00".split(":")
                //if the format of time was 00:00:00
                if(time.length == 3){//13:05:23
                    second += Number(time[0]) * 3600 // convert hour to second
                    second += Number(time[1]) * 60 // convert minute to second
                    second += Number(time[2]) //sum second with seond
                    //if the format of time was 00:00
                }else if(time.length == 2){ //05:23
                    second += Number(time[0]) * 60 // convert minute to second
                    second += Number(time[1]) //sum second with seond
                }else{
                    second = Number(time)
                }
            }
        }
    hour = Math.floor(second / 3600); //convert second to hour
    minute = Math.floor(second / 60) % 60; //convert second to minutes
    second = Math.floor(second % 60); //convert seconds to second
    //if the hour was single digit =>convert it to two digit=>9=>09
    if(String(hour).length ==1) hour = `0${hour}`
    if(String(minute).length ==1) minute = `0${minute}`
    if(String(second).length ==1) second = `0${second}`
    return (hour + ":" + minute + ":" +second) 
}
function calculateDiscount(price, discount){
    return Number(price) - ((Number(discount) / 100) * Number(price))
}
function invoiceNumberGenerator(){
    return moment().format("jYYYYjMMjDDHHmmssSSS") + String(process.hrtime()[1]).padStart(9, 0)
}
async function getBasketOfUser(userID, discount = {}){
    const userDetail = await UserModel.aggregate([
        {
            $match : { _id: userID }
        },
        {
            $project:{ basket: 1}
        },
        {
            $lookup: {
                from: "products",
                localField: "basket.products.productID",
                foreignField: "_id",
                as: "productDetail"
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "basket.courses.courseID",
                foreignField: "_id",
                as: "courseDetail"
            }
        },
        {
            $addFields : {
                "productDetail" : {
                    $function: {
                        body: function(productDetail, products){
                            return productDetail.map(function(product){
                                const count = products.find(item => item.productID.valueOf() == product._id.valueOf()).count;
                                const totalPrice = count * product.price
                                return {
                                    ...product,
                                    basketCount: count,
                                    totalPrice,
                                    finalPrice: totalPrice - ((product.discount / 100) * totalPrice)
                                }
                            })
                        },
                        args: ["$productDetail", "$basket.products"],
                        lang: "js"
                    }
                },
                "courseDetail" : {
                    $function: {
                        body: function(courseDetail){
                            return courseDetail.map(function(course){
                                return {
                                    ...course,
                                    finalPrice: course.price - ((course.discount / 100) * course.price)
                                }
                            })
                        },
                        args: ["$courseDetail"],
                        lang: "js"
                    }
                },
                "payDetail" : {
                    $function: {
                        body: function(courseDetail, productDetail, products){
                            const courseAmount =  courseDetail.reduce(function(total, course){
                                return total + (course.price - ((course.discount / 100) * course.price))
                            }, 0)
                            const productAmount =  productDetail.reduce(function(total, product){
                                const count = products.find(item => item.productID.valueOf() == product._id.valueOf()).count
                                const totalPrice = count * product.price;
                                return total + (totalPrice - ((product.discount / 100) * totalPrice))
                            }, 0)
                            const courseIds = courseDetail.map(course => course._id.valueOf())
                            const productIds = productDetail.map(product => product._id.valueOf())
                            return {
                                courseAmount,
                                productAmount,
                                paymentAmount : courseAmount + productAmount,
                                courseIds,
                                productIds
                            }
                        },
                        args: ["$courseDetail", "$productDetail", "$basket.products"],
                        lang: "js"
                    }
                },
            }
        },{
            $project: {
                basket: 0
            }
        }
    ]);
    return copyObject(userDetail)
}
const stringToArrayFunction = function(arrayField) {
            if(arrayField){
                //if the typeof that body field was string
                if(typeof arrayField == "string"){
                    //if the format of body was #tag1#tag2#tag3
                    if(arrayField.indexOf("#") >=0){
                        arrayField = (arrayField.split("#")).map(item => item.trim())
                        //remove nullish data
                        arrayField=arrayField.filter(item=>item!==undefined||null||""||" ")
                         //remove the repetitive  tags
                        arrayField = [... new Set(arrayField)]
                        //if the format of body was tag1,tag2,tag3
                    }else if(arrayField.indexOf(",") >=0){
                        arrayField = (arrayField.split(",")).map(item => item.trim())
                        //remove nullish data
                        arrayField=arrayField.filter(item=>item!==undefined||null||""||" ")
                         //remove the repetitive  tags
                         console.log(arrayField)
                        arrayField = [... new Set(arrayField)]
                        console.log(arrayField)
                    }else{ 
                        //if client send one tag=>put that tag in array
                        arrayField = [arrayField]
                    }
                }
                //if the format of body field was array
                if(Array.isArray(arrayField)){
                    //trim the each element of array
                    arrayField = arrayField.map(item => item.trim())
                    //remove the repetitive  tags
                    arrayField = [... new Set(arrayField)]
                }
            }else{
                arrayField = []
            }
            return arrayField
    }
async function filter(search="",category="",sort="",model){
    let collection=[]
    if (search) {
        collection = await model.find({
          $text: {$search: new RegExp(search, "ig")}})
      } else {
        collection = await model.find({})
      }
      if(category){
            const { id } = await idPublicValidation.validateAsync({ id: category });
            const cat = await CategoryModel.findById(id);
            if (!category) throw new createError.BadRequest("category not found")
            collection=collection.filter(document=>document.category.equals(cat._id))
        

      }    
      if(sort){
        switch (sort) {
          case "earliest":
            console.log("earliest")
            collection=collection.sort(function(b,a){
             return new Date(b.createdAt) - new Date(a.createdAt)
            })
            break;
          case "most popular":
            console.log("most popular")
            collection=collection.sort(function(a, b){return b.numberOfLikes - a.numberOfLikes})
            break;
          case "most expensive":
            console.log("most expensive")
            collection=collection.sort(function(a, b){return b.price - a.price})
            break;
            case "most discount":
            console.log("most most discount")
            collection=collection.sort(function(a, b){return b.discount - a.discount})
            break;
            case "cheapest":
              console.log("cheapest")
              collection=collection.sort(function(a, b){return a.price - b.price})
              break;
          default:
            collection
        }
      }else{
        console.log("latest")
        collection=collection.sort(function(a,b){
         return new Date(b.createdAt) - new Date(a.createdAt)
        })
      }
      return collection
}
module.exports = {
    RandomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken,
    deleteFileInPublic,
    ListOfImagesFromRequest,
    copyObject,
    setFeatures,
    deleteInvalidPropertyInObject,
    getTime,
    getTimeOfCourse,
    getTimeOfChapter,
    calculateDiscount,
    invoiceNumberGenerator,
    getBasketOfUser,
    deleteImageFolder,
    deleteOneImageInFolder,
    deleteOneImageInNestedTwoLevelFolder,
    stringToArrayFunction,
    filter
}