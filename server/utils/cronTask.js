const cron = require('node-cron');
const Url = require('../models/url');
const redisClient = require('../utils/redis-client');

module.exports = function cronTask() {
    cron.schedule('0 0 * * 0', async () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        await Url.deleteMany({ createdAt: { $lt: oneMonthAgo } });

        redisClient.flushdb((error, succeeded) => {
            if (error) throw error;
            console.log(`Flushed Redis cache: ${succeeded}`);
        });
    });
}