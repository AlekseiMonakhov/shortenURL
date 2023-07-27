require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger');
const { logErrors, clientErrorHandler, errorHandler } = require('./middlewares/errorHandlers');
const cronTask = require('./utils/cronTask');
const cors = require('cors')
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        secure: false, // set this to true in production, false for development
        httpOnly: true,
        sameSite: true // клиент и сервер в одном контейнере
    }
}));
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(urlRoutes);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

cronTask();

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});