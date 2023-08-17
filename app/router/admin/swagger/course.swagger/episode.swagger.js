/**
 * @swagger
 *  definitions:
 *      createEpisode:
 *          type: object
 *          properties:
 *              statusCode:                 
 *                  type: integer
 *                  example: 201
 *              data:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: "episode created successfully"
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          AddEpisode:
 *              type: object
 *              required:
 *                  -   courseID
 *                  -   chapterID
 *                  -   title       
 *                  -   text       
 *                  -   video       
 *                  -   type       
 *              properties:
 *                  courseID:
 *                      type: string
 *                      description: id of the course
 *                      example: 62822e4ff68cdded54aa928d
 *                  chapterID: 
 *                      type: string
 *                      description: id of the chapter
 *                      example: 628dd482330688179ab88203
 *                  title:
 *                      type: string
 *                      description: the title of episode
 *                      example: episode 1
 *                  text: 
 *                      type: string
 *                      description: the describe about this episode
 *                      example: this episode is about ...
 *                  type: 
 *                      type: string
 *                      description: the episode type (unlock or lock)
 *                      enum:
 *                          -   unlock
 *                          -   lock
 *                  video: 
 *                      type: string
 *                      description: the file of video 
 *                      format: binary
 *          EditEpisode:
 *              type: object     
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of episode
 *                      example: episode 1
 *                  text: 
 *                      type: string
 *                      description: the describe about this episode
 *                      example: this episode is about ...
 *                  type: 
 *                      type: string
 *                      description: the episode type (unlock or lock)
 *                      enum:
 *                          -   unlock
 *                          -   lock
 */
/**
 * @swagger
 *  /admin/course/chapter/episode/add:
 *      post:
 *          tags: [Episode(AdminPanel)]
 *          summary: create new episode for chapter
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data: 
 *                      schema:
 *                          $ref: '#/components/schemas/AddEpisode'
 *          responses:
 *              201:
 *                  description: success - created
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/definitions/createEpisode'
 */
/**
 * @swagger
 *  /admin/course/chapter/episode/remove/{episodeID}:
 *      patch:
 *          tags: [Episode(AdminPanel)]
 *          summary: remove episode of Chapter
 *          parameters:
 *              -   in: path
 *                  name: episodeID
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /admin/course/chapter/episode/update/{episodeID}:
 *      patch:
 *          tags: [Episode(AdminPanel)]
 *          summary: edit episode of chapter
 *          parameters:
 *              -   in: path
 *                  name: episodeID
 *                  type: string
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data: 
 *                      schema:
 *                          $ref: '#/components/schemas/EditEpisode'
 *          responses:
 *              201:
 *                  description: success - created
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/definitions/publicDefinition'
 */
