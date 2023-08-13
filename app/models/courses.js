const { default: mongoose } = require("mongoose");

const { getTimeOfCourse, getTimeOfChapter } = require("../utils/functions");
const { CommentSchema } = require("./public.schema");

const EpisodeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    type: {type: String, default: "unlock"},
    time: {type: String, required : true}, 
    //link of the video=>like image
    videoAddress: {type: String, required: true}
}, {toJSON: {virtuals: true}})

const ChapterSchema = new mongoose.Schema({
    title : {type: String, required : true},
    text: {type: String, default : ""},
    episodes : {type: [EpisodeSchema], default : []}
})

const CourseSchema = new mongoose.Schema({
    title : {type: String,min:3,max:30, required : true},
    short_text : {type: String,min:5,max:60, required : true},
    text : {type: String,min:10,max:80, required : true},
    //course like product do not need many images=>one image is enough
    image : {type: String, required : true},
    tags : {type: [String], default : []},
    category : {type: mongoose.Types.ObjectId, ref: "category", required : true},
    comments : {type: [CommentSchema], default : []},
    likes : {type: [mongoose.Types.ObjectId], ref: "user", default : []},
    dislikes : {type: [mongoose.Types.ObjectId], ref: "user", default : []},
    bookmarks : {type: [mongoose.Types.ObjectId], ref: "user", default : []},
    price : {type: Number, default : 0},
    discountedPrice : {type: Number, default : 0},
    discount : {type: Number, default : 0},
    type : {type: String, default: "free"/*free, cash, special */, required : true},
    status: {type: String, default: "notStarted" /*notStarted, Completed, Holding*/},
    //teacher is equal to owner in product schema
    teacher : {type: mongoose.Types.ObjectId, ref: "user", required : true},
    chapters : {type: [ChapterSchema], default: []},
    students : {type : [mongoose.Types.ObjectId], default : [], ref: "user"}
}, {
    toJSON: {
        versionKey:false,
        virtuals: true
    }
});
//index is used in search section
CourseSchema.index({title: "text", short_text: "text", text : "text"})

CourseSchema.virtual("imageURL").get(function(){
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`
})
//total time of all episodes in all chapters
CourseSchema.virtual("coursetotalTime").get(function(){
    return getTimeOfCourse(this.chapters || [])
})
//total time of all episodes of each chapter
EpisodeSchema.virtual("chaptertotalTime").get(function(){
    return getTimeOfChapter(this.chapters || [])
})
//a virtual field related to the Episode schema that is the video link of each episode


module.exports = {
    CourseModel : mongoose.model("course", CourseSchema)
}