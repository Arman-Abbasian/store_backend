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
 *      tags: [api routes]
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