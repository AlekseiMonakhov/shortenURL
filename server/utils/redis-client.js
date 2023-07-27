const Redis = require("ioredis");
const client = new Redis(process.env.REDIS_URL);

client.on("error", function(error) {
    console.error(`Redis client not connected: ${error}`);
});

module.exports = client;