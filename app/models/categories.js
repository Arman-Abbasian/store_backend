const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
    title : {type : String, required : true,unique:true},
    parent : {type : mongoose.Types.ObjectId, ref: "category", default : undefined}
}, {
    id : false,
    toJSON : {
        virtuals: true
    }
});
//add a field to categorySchema =>children
// Schema.virtual("children", {
//     ref : "category",
//     localField : "_id",
//     foreignField: "parent"
// })
// function autoPopulate(next) {
//     this.populate([{path : "children", select : {__v : 0, id : 0}}]);
//     next()
// }
// Schema.pre('findOne', autoPopulate).pre("find", autoPopulate)



module.exports = {
    CategoryModel : mongoose.model("category", Schema)
} 