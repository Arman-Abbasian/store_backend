const mongoose = require("mongoose");
const AnswerSchema = new mongoose.Schema({
    //who answer the comment
    user : {type : mongoose.Types.ObjectId, ref: "user", required: true},
    //text of answer comment
    comment: {type: String, required: true},
    //show or hide the answer comment
    show: {type: Boolean, required: true, default: false},
    openToComment: {type: Boolean, default: false},
    parentComment:{type:mongoose.Types.ObjectId,default:undefined}
}, {
    timestamps : {createdAt: true}
})
const CommentSchema = new mongoose.Schema({
    //who write the comment
    user : {type : mongoose.Types.ObjectId, ref: "user", required: true},
    //text of comment
    comment: {type: String, required: true},
    //show comment or not
    show: {type: Boolean, required: true, default: false},
    openToComment : {type: Boolean, default: true},
    answers : {type: [AnswerSchema], default: []},
}, {
    timestamps : {createdAt: true}
})
module.exports = {
    CommentSchema
}