const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.schema");
const BlogSchema = new mongoose.Schema({
    //author of blog
    author : {type : mongoose.Types.ObjectId, ref: "user", required : true},
    //title of blog
    title : {type : String, required : true},
    short_text : {type : String, required : true},
    //text of blog
    text : {type : String, required : true},
    //image of blog
    image : {type : String, required : true},
    tags : {type : [String], default : []},
    category : {type : mongoose.Types.ObjectId, ref: "category", required :true},
    comments : {type : [CommentSchema], default : []},
    //which users liked the blog
    likes : {type : [mongoose.Types.ObjectId], ref: "user", default : []},
    dislikes : {type : [mongoose.Types.ObjectId], ref: "user", default : []},
    bookmarks : {type : [mongoose.Types.ObjectId], ref: "user", default : []}
}, {
    timestamps : true, 
    versionKey : false,
    toJSON : {
        virtuals: true
    }
});
BlogSchema.virtual("user", {
    ref : "user",
    localField : "_id",
    foreignField: "author"
})
BlogSchema.virtual("category_detail", {
    ref : "category",
    localField : "_id",
    foreignField: "category"
})
BlogSchema.virtual("imageURL").get(function(){
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`
})
module.exports = {
    BlogModel : mongoose.model("blog", BlogSchema)
}