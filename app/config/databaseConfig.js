const { default: mongoose } = require("mongoose");

function configDataBase(DB_URL){
mongoose.set("strictQuery",true);
mongoose.connect(DB_URL)
.then(()=>console.log("mongoose connected to mongodb successfully"))
.catch((err)=>console.log(err))
};
//connected event for mongoose
mongoose.connection.on("connected", () => {
    console.log("mongoose connected to mongodb");
  });
  //dieconnected event for mongoose
  mongoose.connection.on("disconnected", () => {
    console.log("mongoose  disconnected");
  });
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("disconnected");
    process.exit(0);
  });
module.exports={
    configDataBase
}