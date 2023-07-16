function configApplication(app,express){
    const path=require("path")
    //settings for the client send files
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    //config about address for static files
    app.use(express.static(path.join(__dirname,"..","..","public")));
}
module.exports={
    configApplication
}