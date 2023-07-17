const createError=require("http-errors")

function errorHandler(app){
    app.use((req, res, next) => {
        next(createError.NotFound("Not Found"));
      });
      app.use((error, req, res, next) => {
        const serverError = createError.InternalServerError();
        const statusCode = error.status || serverError.status;
        const message = error.message || serverError.message;
        return res.status(statusCode).json({
          statusCode,
          errors: {
            message,
          },
        });
      });
}
module.exports={
    errorHandler
}