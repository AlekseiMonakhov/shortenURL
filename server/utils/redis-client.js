const Redis = require("ioredis");
const client = new Redis();

client.on("error", function(error) {
    console.error(`Redis client not connected: ${error}`);
});

module.exports = client;