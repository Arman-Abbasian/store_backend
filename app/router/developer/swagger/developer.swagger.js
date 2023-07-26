/**
 * @swagger
 *  tags:
 *      name : Developer-Routes
 *      description: developer Utils
 */

/**
 * @swagger
 *  /developer/hash-password/{password}:
 *      get:
 *          tags: [Developer-Routes]
 *          summary: hash password with bcrypt
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: password
 *                  required : true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /developer/random-number: 
 *      get:
 *          tags: [Developer-Routes]
 *          summary: get random number
 *          responses:
 *              200:
 *                  description: success
 */