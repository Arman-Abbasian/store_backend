const mongoose= require("mongoose");

const PermissionSchema = new mongoose.Schema({
    name: {type: String,min:3,max:30, unique: true},
    description: {type: String,min:5,max:100, default: ""}
}, {
    toJSON : {virtuals: true},
    versionKey:false,
    id:false
})

module.exports = {
    PermissionsModel : mongoose.model('permission', PermissionSchema)
}