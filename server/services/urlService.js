const Url = require('../models/url');
const redisClient = require('../utils/redis-client');
let cryptoRandomString;
import('crypto-random-string').then((module) => {
    cryptoRandomString = module.default;
});

const shortenUrlService = async (url, subpart, sessionId) => {
    if (!subpart) {
        subpart = cryptoRandomString({length: 7, type: 'alphanumeric'});
    }

    const existingUrl = await Url.findOne({ subpart });

    if (existingUrl) {
        throw new Error('This URL subpart is already in use');
    }

    const newUrl = new Url({
        url, shortenedUrl: subpart, sessionId
    });

    await newUrl.save();

    redisClient.set(subpart, url);

    return newUrl;
};


const getUrlByShortUrlService = async (shortenedUrl) => {
    return new Promise((resolve, reject) => {
        redisClient.get(shortenedUrl, async (error, url) => {
            if (error) reject(error);

            if (url) {
                resolve(url);
            } else {
                const urlDoc = await Url.findOne({ shortenedUrl });

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
    getUserRequestsService,
    shortenUrlService,
    getUrlByShortUrlService,
    getAllUrlsService
};
