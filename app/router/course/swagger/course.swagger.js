/**
 * @swagger
 *  tags:
 *      name : course routes
 *      description : course-routes section
 */
/**
 * @swagger
 *  definitions:
 *      ListOfCourses:
 *          type: object
 *          properties:
 *              statusCode: 
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      courses:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  title:
 *                                      type: string
 *                                      example: "title of course"
 *                                  short_text:
 *                                      type: string
 *                                      example: "summary text of course"
 *                                  text:
 *                                      type: string
 *                                      example: "text and describe of course"
 *                                  status:
 *                                      type: string
 *                                      example: "notStarted | Completed | Holding"
 *                                  time:
 *                                      type: string
 *                                      example: "01:22:34"
 *                                  price:
 *                                      type: integer
 *                                      example: 200
 *                                  discount:
 *                                      type: interger
 *                                      example: 20
 *                                  discountedPrice:
 *                                      type: interger
 *                                      example: 160
 *                                  studendtCount:
 *                                      type: integer
 *                                      example: 340
 *                                  teacher:
 *                                      type: string
 *                                      example: "Arman Abasian"
 */
/**
 * @swagger
 *  definitions:
 *      Course:
 *          type: object
 *          properties:
 *              statusCode: 
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      course:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                 type: string
 *                                 example: "62822e4ff68cdded54aa928d"
 *                              title:
 *                                 type: string
 *                                 example: "title of course"
 *                              short_text:
 *                                 type: string
 *                                 example: "summary text of course"
 *                              text:
 *                                 type: string
 *                                 example: "text and describe of course"
 *                              image:
 *                                 type: string
 *                                 example: "uploads/courseImages/1691919566808/1691919566810.jpg"
 *                              tags:
 *                                 type: array
 *                                 items:
 *                                     type: string
 *                                     example: "tag1, tag2"
 *                              likes:
 *                                 type: array
 *                                 items:
 *                                     type: string
 *                                     example: "62822e4ff68cdded54aa928d, 62835e4ff68cdded54aa928d"
 *                              dislikes:
 *                                 type: array
 *                                 items:
 *                                     type: string
 *                                     example: "62822e4ff68cdded54aa928d, 62835e4ff68cdded54aa928d"
 *                              bookmarks:
 *                                 type: array
 *                                 items:
 *                                     type: string
 *                                     example: "62822e4ff68cdded54aa928d, 62835e4ff68cdded54aa928d"
 *                              status:
 *                                 type: string
 *                                 example: "notStarted | Completed | Holding"
 *                              time:
 *                                 type: string
 *                                 example: "01:22:34"
 *                              price:
 *                                 type: integer
 *                                 example: 200
 *                              discount:
 *                                 type: interger
 *                                 example: 20
 *                              discountedPrice:
 *                                 type: interger
 *                                 example: 160
 *                              teacher:
 *                                  type: object
 *                                  properties:
 *                                      _id: 
 *                                          type: string
 *                                          example: "62822e4ff68cdded54aa928d"
 *                                      mobile:
 *                                          type: string
 *                                          example: "62822e4ff68cdded54aa928d"
 *                                      first-name: 
 *                                          type: string
 *                                          example: "Arman"
 *                                      last-name:
 *                                          type: string
 *                                          example: "Abasian"
 *                              students:
 *                                 type: array
 *                                 items:
 *                                     type: string
 *                                     example: "62822e4ff68cdded54aa928d, 62835e4ff68cdded54aa928d"
 *                              comments:
 *                                 type: array
 *                                 items:
 *                                     type: object
 *                                     properties:
 *                                      user: 
 *                                          type: string
 *                                          example: "62822e4ff68cdded54aa928d"
 *                                      comment: 
 *                                          type: string
 *                                          example: "this was so good, very well"
 *                                      answers:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  title:
 *                                                      type: string
 *                                                      example: title of episode
 *                                                  text:
 *                                                      type: string
 *                                                      example: text of the episode
 *                                                  type:
 *                                                      type: string
 *                                                      example: "unlocked | locked"
 *                                                  time:
 *                                                      type: string
 *                                                      example: "00:54:41"
 *                                                  videoAddress:
 *                                                      type: string
 *                                                      example: "http//localhost:5000/uploads/episodeVideos/148745887421/4748745952.mp4"
 *                              chapters:
 *                                 type: array
 *                                 items:
 *                                     type: string
 *                                     example: "chapter 1, chapter 2"
 *                              studendtCount:
 *                                type: integer
 *                                example: 340
 */
/**
 * @swagger
 *  /courses/list:
 *      get:
 *          tags: [course routes]
 *          summary: get all of courses
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: text for search in title, text, short_text of (courses)
 *              -   in: query
 *                  name: category
 *                  type: string
 *                  description: select a category
 *                  example: 64c130e16b37c59b68a033a9
 *              -   in: query
 *                  name: sort
 *                  type: string
 *                  description: sort based on ...
 *                  example: latest-earliest-most expensive-most cheapest-most popular-most discount
 *          responses :
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ListOfCourses'
 */

/**
 * @swagger
 *  /courses/{id}:
 *      get:
 *          tags: [course routes]
 *          summary: get one of courses by ObjectId
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: find course by id
 *          responses :
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/Course'
 */