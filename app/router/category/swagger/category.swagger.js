/**
 * @swagger
 *  tags:
 *      name : category routes
 *      description : user-routes section
 */
/**
 * @swagger
 *  /category/parents:
 *      get:
 *          tags: [category routes]
 *          summary: get All parents of Category or Category Heads
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/category/children/{parent}:
 *      get:
 *          tags: [category routes]
 *          summary: get All children of Parents Category 
 *          parameters:
 *              -   in: path
 *                  name: parent
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/category/all:
 *      get:
 *          tags: [category routes]
 *          summary: get All Categories 
 *          responses:
 *              200:
 *                  description: success
 */

/**
 * @swagger
 *  /admin/category/list-of-all:
 *      get:
 *          tags: [category routes]
 *          summary: get all categories without populate and nested structure
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/category/{id}:
 *      get:
 *          tags: [category routes]
 *          summary: find category by object-id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required : true
 *          responses:
 *              200:
 *                  description: success
 */
