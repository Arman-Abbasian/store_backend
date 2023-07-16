const { AllRoutes } = require("../router/router")


function createRoutes(app){
   app.use(AllRoutes)
}
module.exports={
    createRoutes
}