const cron = require('node-cron');
const Url = require('../models/url');
const redisClient = require('../utils/redis-client');

module.exports = function cronTask() {
    // Задача для удаления старых записей
    cron.schedule('0 0 * * 0', async () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        await Url.deleteMany({ createdAt: { $lt: oneMonthAgo } });

        // Очищаем кеш Redis
        redisClient.flushdb((error, succeeded) => {
            if (error) throw error;
            console.log(`Flushed Redis cache: ${succeeded}`);
        });
    });
}