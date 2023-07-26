const Url = require('../models/url');
const redisClient = require('../utils/redis-client');
const cryptoRandomString = import('crypto-random-string');

const shortenUrlService = async (url, shortenedUrl, sessionId) => {
    if (!shortenedUrl) {
        shortenedUrl = cryptoRandomString({length: 7, type: 'alphanumeric'});
    }

    const existingUrl = await Url.findOne({ shortenedUrl });

    if (existingUrl) {
        throw new Error('This URL is already in use');
    }

    const newUrl = new Url({ url, shortenedUrl, sessionId });
    await newUrl.save();

    redisClient.set(shortenedUrl, url);

    return newUrl;
};

const getUrlByShortUrlService = async (shortenedUrl) => {
    return new Promise((resolve, reject) => {
        redisClient.get(shortenedUrl, async (error, url) => {
            if (error) reject(error);

            if (url) {
                resolve(url);
            } else {
                const urlDoc = await Url.findOne({ shortenedUrl: shortenedUrl });

                if (urlDoc) {
                    redisClient.set(shortenedUrl, urlDoc.url);
                    urlDoc.clicks += 1;
                    await urlDoc.save();
                    resolve(urlDoc.url);
                } else {
                    reject(new Error('URL not found'));
                }
            }
        });
    });
};


const getAllUrlsService = async (sessionId) => {
    const urls = await Url.find({ sessionId: sessionId });
    return urls;
};

const getUserRequestsService = async () => {
    const userRequests = await Url.aggregate([
        {
            $group: {
                _id: "$sessionId",
                numberOfRequests: { $sum: "$clicks" }
            }
        }
    ]);

    return userRequests;
};

module.exports = {
    shortenUrlService,
    getUrlByShortUrlService,
    getAllUrlsService,
    getUserRequestsService
};
