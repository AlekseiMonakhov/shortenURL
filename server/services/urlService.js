const Url = require('../models/url');
let cryptoRandomString;
import('crypto-random-string').then((module) => {
    cryptoRandomString = module.default;
});

class UrlService {
    async shortenUrl(url, subpart, sessionId) {
        if (!subpart) {
            subpart = cryptoRandomString({ length: 7, type: 'alphanumeric' });
        }
        const existingUrl = await Url.findOne({ shortenedUrl: subpart });
        if (existingUrl) {
            throw new Error("This subpart is already taken");
        }

        const newUrl = new Url({
            url, shortenedUrl: subpart, sessionId
        });

        await newUrl.save();

        return newUrl;
    }

    async getUrlByShortUrl(shortenedUrl) {
        try {
            const urlDoc = await Url.findOne({ shortenedUrl });

            if (urlDoc) {
                urlDoc.clicks += 1;
                await urlDoc.save();
                return urlDoc.url;
            } else {
                throw new Error('URL not found');
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllUrls(sessionId) {
        const urls = await Url.find({ sessionId: sessionId });
        return urls;
    }

    async getUserRequests() {
        const userRequests = await Url.aggregate([
            {
                $group: {
                    _id: "$sessionId",
                    numberOfRequests: { $sum: "$clicks" }
                }
            }
        ]);

        return userRequests;
    }
}

module.exports = UrlService;
