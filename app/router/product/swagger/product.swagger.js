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
 *              -   in: query
 *                  name: category
 *                  type: string
 *                  description: select a category
 *                  example: 64c130e16b37c59b68a033a9
 *              -   in: query
 *                  name: sort
 *                  type: string
 *                  description: sort based on ...
 *                  example: latest-earliest-most expensive-most cheapest-most popular
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
