const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

router.get('/urls', urlController.getAllUrls);

router.get('/user-requests', urlController.getUserRequests);

router.post('/shorten', urlController.shortenUrl);

router.get('/:shortenedUrl', urlController.getUrlByShortUrl);

module.exports = router;
