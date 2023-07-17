const {homeController} = require("../../http/controllers/api/api.controller");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: api routes
 *  description : api route and data
 */

/**
 * @swagger
 * /:
 *  get:
 *      summary: http://localhost:5000 
 *      tags: [GET => http://localhost:5000]
 *      description : get all need data for http://localhost:5000 page
 *      parameters:
 *          -   in: header
 *              name: access-token
 *              example: Bearer YourToken...
 *      responses:
 *          200:
 *              description: success
 *              schema: 
 *                  type: string
 *                  example : Index Page Store
 *          404: 
 *              description: not Found
 */

router.get("/", homeController.indexPage);

module.exports = {
    HomeRoutes : router
}