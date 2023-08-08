/**
 * @swagger
 *  tags:
 *      name : product routes
 *      description : product-routes section
 */
/**
 * @swagger
 *  /products/list:
 *      get:
 *          tags: [product routes]
 *          summary: get all products
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: text for search in title, text, short_text of (product)
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /products/{id}:
 *      get:
 *          tags: [product routes]
 *          summary: get one products
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 */
