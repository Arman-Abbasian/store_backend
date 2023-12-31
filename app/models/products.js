const { default: mongoose } = require("mongoose");
const { ParentCommentSchema } = require("./public.schema");
const ProductSchema = new mongoose.Schema({
    title : {type: String,min:3,max:30, required : true},
    short_text : {type: String,min:5,max:60, required : true},
    text : {type: String,min:10,max:80, required : true},
    //images of product=>is a array of links
    images : {type: [String], required : true},
    tags : {type: [String], default : []},
    //category of product
    category : {type: mongoose.Types.ObjectId, ref: "category", required : true},
    //list of comments for this product
    comments : {type: [ParentCommentSchema], default : []},
    likes : {type: [mongoose.Types.ObjectId],ref:'user', default : []},
    dislikes : {type: [mongoose.Types.ObjectId],ref:'user', default : []},
    bookmarks : {type: [mongoose.Types.ObjectId],ref:'user', default : []},
    price : {type: Number, default : 0},
    discount : {type: Number, default : 0},
    discountedPrice:{type: Number, default : function(){ 
        return (this.price * (1-(this.discount / 100)))}
    },
    //number of this product in store
    count : {type: Number},
    type : {type: String, required : true}, //virtual - physical
    format : {type: String},
    supplier : {type: mongoose.Types.ObjectId, ref:"user", required : true},
    colors : {type: [String], default:[]},
    //if the product is physical, this is the features of physical product
    features : {type: Object, default : {
        length : "",
        height : "",
        width : "",
        weight : "",
        madein : ""
    }},
}, {
    timestamps : true, 
    //delete the __V field
    versionKey : false,
    toJSON: {
        virtuals: true
    }
});
ProductSchema.index({title : "text", short_text : "text", text : "text"})
ProductSchema.virtual("imagesURL").get(function(){
    return this.images.map(image => `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${image}`)
})
ProductSchema.virtual("numberOfLikes").get(function(){
    return this.likes.length
})
ProductSchema.virtual("numberOfBookmarks").get(function(){
    return this.bookmarks.length
})
module.exports = {
    ProductModel : mongoose.model("product", ProductSchema)
}