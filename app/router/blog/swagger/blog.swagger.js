/**
 * @swagger
 *  tags:
 *      name : blog routes
 *      description : user-routes section
 */

/**
 * @swagger
 *  /admin/blogs:
 *      get:
 *          tags: [ blog routes]
 *          summary: get all blogs
 *          responses:
 *              200:
 *                  description: success - get array of blogs
 */

/**
 * @swagger
 *  /admin/blogs/{id}:
 *      get:
 *          summary: get blog by ID and populate this field 
 *          tags: [ blog routes ]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */

