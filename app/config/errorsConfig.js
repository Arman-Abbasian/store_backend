const { NotFoundError, ErrorHandler } = require("../http/middlewares/errorHandling");

function errorHandler(app){
app.use(NotFoundError);
app.use(ErrorHandler)
}
module.exports={
    errorHandler
}