const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cryptoRandomString = import('crypto-random-string');
const redisClient = require('./redis-client');
const cron = require('node-cron');
const winston = require('winston');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '1.0.0',
            description: 'API documentation for URL Shortener',
            servers: ['http://localhost:3001']
        },
    },
    apis: ['server.js'],
};

// Create Swagger document
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Setup logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

app.use(express.json());
app.use(session({
    secret: 'supersecretstring12345!',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/url-shortener' })
}));

mongoose.connect('mongodb://localhost:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const urlSchema = new mongoose.Schema({
    url: String,
    shortenedUrl: String,
    sessionId: String,
    createdAt: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 }
});

const Url = mongoose.model('Url', urlSchema);

/**
 * @swagger
 * /urls:
 *   get:
 *     description: Get all urls for the current session
 *     responses:
 *       200:
 *         description: Success
 *
 */
app.get('/urls', async (req, res) => {
    const urls = await Url.find({ sessionId: req.session.id });
    res.json(urls);
});

/**
 * @swagger
 * /shorten:
 *   post:
 *     description: Create a shortened url
 *     parameters:
 *       - in: body
 *         name: url
 *         description: The url to shorten.
 *         schema:
 *           type: object
 *           required:
 *             - url
 *           properties:
 *             url:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 *
 */
app.post('/shorten', async (req, res) => {
    let { url, shortenedUrl } = req.body;

    if (!shortenedUrl) {
        shortenedUrl = cryptoRandomString({ length: 7, type: 'alphanumeric' });
    }

    const existingUrl = await Url.findOne({ shortenedUrl });

    if (existingUrl) {
        return res.status(400).json({ message: 'This URL is already in use' });
    }

    const newUrl = new Url({ url, shortenedUrl, sessionId: req.session.id });
    await newUrl.save();

    redisClient.set(shortenedUrl, url);

    logger.info(`Shortened URL created: ${newUrl}`);

    res.json(newUrl);
});

/**
 * @swagger
 * /{shortenedUrl}:
 *   get:
 *     description: Redirect to the original url using the shortened url
 *     parameters:
 *       - in: path
 *         name: shortenedUrl
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirecting to the original url
 *       404:
 *         description: Shortened url not found
 */
app.get('/:shortenedUrl', async (req, res) => {
    redisClient.get(req.params.shortenedUrl, async (error, url) => {
        if (error) {
            logger.error(`Redis error: ${error}`);
            throw error;
        }

        if (url) {
            res.redirect(url);
        } else {
            const urlDoc = await Url.findOne({ shortenedUrl: req.params.shortenedUrl });

            if (urlDoc) {
                redisClient.set(req.params.shortenedUrl, urlDoc.url);
                urlDoc.clicks += 1;
                await urlDoc.save();
                res.redirect(urlDoc.url);
            } else {
                res.status(404).json({ message: 'URL not found' });
            }
        }
    });
});

/**
 * @swagger
 * /user-requests:
 *   get:
 *     description: Get all user requests
 *     responses:
 *       200:
 *         description: Success
 *
 */
app.get('/user-requests', async (req, res) => {
    const userRequests = await Url.aggregate([
        {
            $group: {
                _id: "$sessionId",
                numberOfRequests: { $sum: "$clicks" }
            }
        }
    ]);

    res.json(userRequests);
});

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// Delete old entries every week
cron.schedule('0 0 * * 0', async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    await Url.deleteMany({ createdAt: { $lt: oneMonthAgo } });

    // Flush Redis cache
    redisClient.flushdb((error, succeeded) => {
        if (error) {
            logger.error(`Redis flushdb error: ${error}`);
            throw error;
        }
        logger.info(`Flushed Redis cache: ${succeeded}`);
    });
});

app.listen(3001, () => {
    logger.info('Server is running on port 3001');
});
