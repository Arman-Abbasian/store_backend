const { configApplication } = require("./config/applicationConfig");
const { configDataBase } = require("./config/databaseConfig");
const { errorHandler } = require("./config/errorsConfig");
const { otherConfigs } = require("./config/otherConfigs");
const { createRoutes } = require("./config/routesConfig");
const { createServer } = require("./config/serverConfig");

class Application{
    #express=require("express");
    #app=this.#express();
    constructor(PORT,DB_URL){
        configDataBase(DB_URL)
        configApplication(this.#app,this.#express)
        createServer(this.#app,PORT)
        createRoutes(this.#app)
        otherConfigs();
        errorHandler(this.#app)
    }
}
module.exports={
    Application
}