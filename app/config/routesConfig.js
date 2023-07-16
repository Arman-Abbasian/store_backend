//const { AllRoutes } = require("../router/index.routes")

function createRoutes(app){
   app.use(AllRoutes)
}
module.exports={
    createRoutes
}