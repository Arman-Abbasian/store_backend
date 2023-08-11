
/**
 * @swagger
 *  components:
 *      schemas:
 *          Color:
 *              type: array
 *              items: 
 *                  type: string
 *                  enum:
 *                      -   black
 *                      -   white
 *                      -   gray                
 *                      -   red
 *                      -   blue
 *                      -   green
 *                      -   orange
 *                      -   purple
 */ 

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              required: 
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   count
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: the title of product
 *                  short_text:
 *                      type: string
 *                      description: the short_text of product
 *                      example: a short text about product
 *                  text:
 *                      type: string
 *                      description: the text of product
 *                      example: description about product
 *                  tags:
 *                      type: array
 *                      description: the tags of product
 *                  category:
 *                      type: string
 *                      description: the category of product
 *                      example: 6279e994c1e47a98d0f356d3
 *                  price:
 *                      type: string
 *                      description: the price of product
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: the discount of product
 *                      example: 20
 *                  count:
 *                      type: string
 *                      description: the count of product
 *                      example: 100
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                      example: 0
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  type:
 *                      type: string
 *                      description: the type of product 
 *                      example: virtual - physical
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *                      
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Product:
 *              type: object
 *              required: 
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   count
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: the title of product
 *                  short_text:
 *                      type: string
 *                      description: the short_text of product
 *                      example: a short text about product
 *                  text:
 *                      type: string
 *                      description: the text of product
 *                      example: description about product
 *                  tags:
 *                      type: array
 *                      description: the tags of product
 *                  category:
 *                      type: string
 *                      description: the category of product
 *                      example: 6279e994c1e47a98d0f356d3
 *                  price:
 *                      type: string
 *                      description: the price of product
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: the discount of product
 *                      example: 20
 *                  count:
 *                      type: string
 *                      description: the count of product
 *                      example: 100
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                      example: 0
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  type:
 *                      type: string
 *                      description: the type of product 
 *                      example: virtual - physical
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *                      
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Product-Add-Image:
 *              type: object
 *              properties:
 *                  image:
 *                      type: file
 *                      description: the index picture of blog 
 *                  
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Product-Delete-Image:
 *              type: object
 *              properties:
 *                  imageLink:
 *                      type: string
 *                      description: http address of image 
 *                      example: http://localhost:5000/public/uploads/pdroductImages/145521478745/4147854125.jpg   
 *                
 */
/**
 * @swagger
 *  /admin/product/add:
 *      post:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          
 *          responses:
 *              201:
 *                  description: created new Product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 * 
 */
/**
 * @swagger
 *  /admin/product/remove/{id}:
 *      delete:
 *          tags: [Product(AdminPanel)]
 *          summary: delete One products
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 * 
 */
/**
 * @swagger
 *  /admin/product/edit/{id}:
 *      patch:
 *          tags: [Product(AdminPanel)]
 *          summary: edit product
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: objectId of product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product'
 *          
 *          responses:
 *              200:
 *                  description: Product edited successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 * 
 */
/**
 * @swagger
 *  /admin/product/deleteImage/{id}:
 *      patch:
 *          tags: [Product(AdminPanel)]
 *          summary: delete image product
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: id of product for delete product image
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product-Delete-Image'
 *                  application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Edit-Product-Delete-Image' 
 *          responses:
 *              200:
 *                  description: updated Product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 * 
 */
/**
 * @swagger
 *  /admin/product/addImage/{id}:
 *      patch:
 *          tags: [Product(AdminPanel)]
 *          summary: add product images
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: id of product for update product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product-Add-Image'
 *          responses:
 *              200:
 *                  description: updated Product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */