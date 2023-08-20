const mongoose= require("mongoose");

const RoleSchema = new mongoose.Schema({
    title: {type: String,min:3,max:30, unique: true},
    description: {type: String,min:5,max:100, default: ""},
    permissions: {type: [mongoose.Types.ObjectId], ref : 'permission', default: []}
}, {
    toJSON : {virtuals: true},
    versionKey:false,
    id:false
})

module.exports = {
    RoleModel : mongoose.model('role', RoleSchema)
}