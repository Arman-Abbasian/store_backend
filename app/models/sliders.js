const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
    title : {type : String},
    text : {type : String},
    image : {type : String, required : true},
    // type is related to the place that we want to show the slider(header, footer, ...)
    type : {type : String, default : "main"}
});
module.exports = {
    SliderModel : mongoose.model("slider", Schema)
}