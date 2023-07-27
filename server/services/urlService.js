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

    const fullShortenedUrl = `http://localhost/${subpart}`;

    const newUrl = new Url({
        url, shortenedUrl: fullShortenedUrl, sessionId
    });

    await newUrl.save();

    redisClient.set(fullShortenedUrl, url);

    return newUrl;
};

const getUrlByShortUrlService = async (fullShortenedUrl) => {
    return new Promise((resolve, reject) => {
        redisClient.get(fullShortenedUrl, async (error, url) => {
            if (error) reject(error);

            if (url) {
                resolve(url);
            } else {
                const urlDoc = await Url.findOne({ shortenedUrl: fullShortenedUrl });

                if (urlDoc) {
                    redisClient.set(fullShortenedUrl, urlDoc.url);
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
    console.log('Session ID:', sessionId); // потом удалить
    const urls = await Url.find({ sessionId: sessionId });
    console.log('URLs:', urls); // И это
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
