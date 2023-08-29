const UrlService = require('../services/urlService');

const urlServiceInstance = new UrlService();

const shortenUrl = async (req, res, next) => {
    try {
        const newUrl = await urlServiceInstance.shortenUrl(req.body.url, req.body.subpart, req.session.id);
        res.json(newUrl);
    } catch (error) {
        if (error.message === "This subpart is already taken") {
            res.status(205).json();
        } else {
            next(error);
        }
    }
};

const getUrlByShortUrl = async (req, res, next) => {
    try {
        const url = await urlServiceInstance.getUrlByShortUrl(req.params.shortenedUrl);
        res.redirect(url);
    } catch (error) {
        next(error);
    }
};

const getAllUrls = async (req, res, next) => {
    try {
        const urls = await urlServiceInstance.getAllUrls(req.session.id);
        res.json(urls);
    } catch (error) {
        next(error);
    }
};

const getUserRequests = async (req, res, next) => {
    try {
        const userRequests = await urlServiceInstance.getUserRequests();
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
