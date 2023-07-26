const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
    console.error(`Redis client not connected: ${error}`);
});

module.exports = client;
