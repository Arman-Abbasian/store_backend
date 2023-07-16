const { default: mongoose } = require("mongoose");

function configDataBase(DB_URL){
mongoose.set("strictQuery",true);
mongoose.connect(DB_URL)
.then(()=>console.log("mongoose connected to mongodb successfully"))
.catch((err)=>console.log(err))
};
module.exports={
    configDataBase
}