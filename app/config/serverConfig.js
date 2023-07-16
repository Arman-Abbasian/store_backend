function createServer(app,PORT){
    app.listen(PORT,()=>{
        console.log("web server made successfully")
    })
}
module.exports={
    createServer
}