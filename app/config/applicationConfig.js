const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors=require("cors")
const path=require("path")

function configApplication(app,express){
    app.use(cors())
    //morgan package to log all client requests
    app.use(morgan("dev"));
    //settings for the client send files
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    //config about address for static files
    app.use(express.static(path.join(__dirname,"..","..","public")));
    // swagger config
    //swagger is available on port http//:localhost:5000/api-doc
    app.use(
        "/api-doc",
        swaggerUI.serve,
        swaggerUI.setup(
          swaggerJsDoc({
            swaggerDefinition: {
              //version of swagger
              openapi: "3.0.0",
              info: {
                title: "backend-store",
                version: "2.0.0",
                description:
                  "first full backend project with node-js",
                contact: {
                  name: "Arman Abasian",
                  url: "linkedin",
                  email: "abasian.arman@gmail.com",
                },
              },
              // here is the base url of the project
              servers: [
                {
                  url: "http://localhost:5000",
                },
                {
                    url: "http://localhost:4000",
                  },
              ],
              components : {
                //with this work in all the client request , set a header with the "Authentication"
                //property that have the token value and we do not have to set header parameter in
                //every route that need to authentication
                securitySchemes : {
                  //here we define the strategies for authentication in project
                  BearerAuth : {
                    type: "http",
                    //our strategy
                    scheme: "bearer",
                    //kind of token
                    bearerFormat: "JWT",
                    
                  }
                }
              },
              //here we introduce out strategy for authentication
              security : [{BearerAuth : [] }]
            },
            //address of swagger files in project=> app/router/---/---.js
            apis: ["./app/router/**/*.js"],
          }),
          {explorer: true},
        )
      );
}
module.exports={
    configApplication
}