const mongoose = require("mongoose");
//because we have comment in many schemas(products,courses,blogs,...) =>we need a public schema
const AnswerSchema = new mongoose.Schema({
    //who answer the comment
    user : {type : mongoose.Types.ObjectId, ref: "user", required: true},
    //text of answer comment
    comment: {type: String, required: true},
    //show or hide the answer comment
    show: {type: Boolean, required: true, default: false},
    //can any one register a answer for this comment
    openToComment: {type: Boolean, default: false},
    //which comment is the parent comment of this answer comment
    parentComment:{type:mongoose.Types.ObjectId,default:undefined}
}, {
    timestamps : {createdAt: true}
})
const ParentCommentSchema = new mongoose.Schema({
    //who write the comment
    user : {type : mongoose.Types.ObjectId, ref: "user", required: true},
    //text of comment
    comment: {type: String, required: true},
    //show comment or not
    show: {type: Boolean, required: true, default: false},
    // can a user put a comment or not 
    openToComment : {type: Boolean, default: true},
    //all answers to this parent comment
    answers : {type: [AnswerSchema], default: []},
}, {
    timestamps : {createdAt: true}
})
module.exports = {
    ParentCommentSchema
}