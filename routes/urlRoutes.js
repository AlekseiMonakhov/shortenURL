const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

/**
 * @swagger
 * /urls:
 *  get:
 *    summary: Retrieve a list of URLs
 *    responses:
 *      200:
 *        description: A list of URLs.
 */
router.get('/urls', urlController.getAllUrls);

/**
 * @swagger
 * /shorten:
 *  post:
 *    summary: Shorten a URL
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *            required:
 *              - url
 *    responses:
 *      200:
 *        description: The shortened URL.
 */
router.post('/shorten', urlController.shortenUrl);

/**
 * @swagger
 * /{shortenedUrl}:
 *  get:
 *    summary: Redirect to the original URL
 *    parameters:
 *      - in: path
 *        name: shortenedUrl
 *        required: true
 *        description: The shortened URL.
 *    responses:
 *      200:
 *        description: Redirects to the original URL.
 */
router.get('/:shortenedUrl', urlController.getUrlByShortUrl);

/**
 * @swagger
 * /user-requests:
 *  get:
 *    summary: Retrieve the number of requests per user
 *    responses:
 *      200:
 *        description: The number of requests per user.
 */
router.get('/user-requests', urlController.getUserRequests);

module.exports = router;
