const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

/**
 * @swagger
 * /urls:
 *  get:
 *    summary: Retrieve a list of URLs for a specific user
 *    description: Fetches all URLs that have been shortened by a specific user, identified by their session ID.
 *    responses:
 *      200:
 *        description: Successful retrieval of URLs associated with the user's session ID.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Url'
 *      401:
 *        description: Unauthorized. The session ID does not exist or is not valid.
 *
 * components:
 *  schemas:
 *    Url:
 *      type: object
 *      properties:
 *        originalUrl:
 *          type: string
 *        shortenedUrl:
 *          type: string
 */

router.get('/urls', urlController.getAllUrls);

/**
 * @swagger
 * /user-requests:
 *  get:
 *    summary: Retrieve the number of requests per every user
 *    description: Returns a count of URLs requests grouped by user session.
 *    responses:
 *      200:
 *        description: Successful retrieval of the request count.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    description: The session ID of the user.
 *                  numberOfRequests:
 *                    type: integer
 *                    description: The number of URL requests.
 */

router.get('/user-requests', urlController.getUserRequests);

/**
 * @swagger
 * /shorten:
 *  post:
 *    summary: Shorten a URL
 *    description: Create a shortened URL. An optional subpart can be provided.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *                description: The original URL to be shortened.
 *              subpart:
 *                type: string
 *                description: An optional string to be used as the shortened URL subpart.
 *            required:
 *              - url
 *    responses:
 *      200:
 *        description: The shortened URL was created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                originalUrl:
 *                  type: string
 *                shortenedUrl:
 *                  type: string
 */

router.post('/shorten', urlController.shortenUrl);

/**
 * @swagger
 * /{shortenedUrl}:
 *  get:
 *    summary: Redirect to the original URL
 *    description: Uses the shortened URL to redirect to the original URL.
 *    parameters:
 *      - in: path
 *        name: shortenedUrl
 *        required: true
 *        description: The shortened URL.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Redirects to the original URL.
 *      404:
 *        description: The specified shortened URL does not exist.
 */

router.get('/:shortenedUrl', urlController.getUrlByShortUrl);

module.exports = router;
