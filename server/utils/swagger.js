const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener Service',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3001/api/v1',
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
