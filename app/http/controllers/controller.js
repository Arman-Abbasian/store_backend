const autoBind = require("auto-bind");

 class Controller{
    constructor(){
        autoBind(this)
    }
    testMethod(){
        return "Test String"
    }
}
module.exports={
    Controller
}