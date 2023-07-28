const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
    title : {type : String, required : true,unique:true},
    parent : {type : mongoose.Types.ObjectId, ref: "category", default : undefined}
}, {
    //means id filed(that mongoose self produce it)do not showed
    id : false,
    toJSON : {
        //let to add field to the category documents
        virtuals: true
    }
});
//add a field to categorySchema =>children
//the value of children=>go in category collection and find all documents that their parent filed value is
//equal to _id field 
Schema.virtual("children", {
    ref : "category",
    localField : "_id",
    foreignField: "parent"
})
function autoPopulate(next) {
    this.populate([{path : "children", select : {__v : 0, id : 0}}]);
    next()
}
//every time that we use -findOne- or -find- mehod after doing these method, do autoPopulate method
Schema.pre('findOne', autoPopulate).pre("find", autoPopulate)



module.exports = {
    CategoryModel : mongoose.model("category", Schema)
} 