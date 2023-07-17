const morgan = require("morgan");

function configApplication(app,express){
    const path=require("path")
    //morgan package to log all client requests
    app.use(morgan("dev"));
    //settings for the client send files
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    //config about address for static files
    app.use(express.static(path.join(__dirname,"..","..","public")));
}
module.exports={
    configApplication
}