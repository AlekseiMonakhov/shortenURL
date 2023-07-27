const urlService = require('../services/urlService');

const shortenUrl = async (req, res) => {
    try {
        const newUrl = await urlService.shortenUrlService(req.body.url, req.body.subpart, req.session.id);
        res.json(newUrl);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUrlByShortUrl = async (req, res, next) => {
    try {
        const url = await urlService.getUrlByShortUrlService(req.params.shortenedUrl);
        res.redirect(url);
    } catch (error) {
        next(error);
    }
};

const getAllUrls = async (req, res, next) => {
    try {
        const urls = await urlService.getAllUrlsService(req.session.id);
        res.json(urls);
    } catch (error) {
        next(error);
    }
};

const getUserRequests = async (req, res, next) => {
    try {
        const userRequests = await urlService.getUserRequestsService();
        res.json(userRequests);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    shortenUrl,
    getUrlByShortUrl,
    getAllUrls,
    getUserRequests
};
