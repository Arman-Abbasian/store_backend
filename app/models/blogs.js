const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.schema");
const BlogSchema = new mongoose.Schema({
    //author of blog
    author : {type : mongoose.Types.ObjectId, ref: "user", required : true},
    //title of blog
    title : {type : String, required : true, unique:true},
    //a short text of blog
    short_text : {type : String, required : true},
    //text of blog
    text : {type : String, required : true},
    //image of blog=>the value is a link
    image : {type : String, required : true},
    tags : {type : [String], default : []},
    // category that related to the blog
    category : {type : mongoose.Types.ObjectId, ref: "category", required :true},
    //comments that the users add under a blog
    comments : {type : [CommentSchema], default : []},
    //which users liked the blog
    likes : {type : [mongoose.Types.ObjectId], ref: "user", default : []},
    dislikes : {type : [mongoose.Types.ObjectId], ref: "user", default : []},
    bookmarks : {type : [mongoose.Types.ObjectId], ref: "user", default : []}
}, {
    timestamps : true, 
    //delete the __V field
    versionKey : false,
    //give the allowance to make virtual fields
    toJSON : {
        virtuals: true
    }
});
//make the imageURL field=>virtual
BlogSchema.virtual("imageURL").get(function(){
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`
})
module.exports = {
    BlogModel : mongoose.model("blog", BlogSchema)
}