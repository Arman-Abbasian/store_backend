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
    app.use(
        "/api-doc",
        swaggerUI.serve,
        swaggerUI.setup(
          swaggerJsDoc({
            swaggerDefinition: {
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
              servers: [
                {
                  url: "http://localhost:5000",
                },
                {
                    url: "http://localhost:4000",
                  },
              ],
              components : {
                securitySchemes : {
                  BearerAuth : {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    
                  }
                }
              },
              security : [{BearerAuth : [] }]
            },
            apis: ["./app/router/**/*.js"],
          }),
          {explorer: true},
        )
      );
}
module.exports={
    configApplication
}