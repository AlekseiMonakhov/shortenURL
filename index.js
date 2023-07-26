const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cryptoRandomString = import('crypto-random-string');


const app = express();

// Подключаемся к MongoDB
mongoose.connect('mongodb://localhost/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB!');
});

// Создаем схему и модель для хранения URL
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortenedUrl: String,
    sessionId: String
});
const Url = mongoose.model('Url', urlSchema);

app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/url-shortener' })
}));

// Реализация REST API
// Создание нового URL
app.post('/url', async (req, res) => {
    const { originalUrl, shortenedUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ message: 'Invalid request: originalUrl is required' });
    }

    let finalShortenedUrl = shortenedUrl;

    // Если пользователь не предоставил короткую ссылку, генерируем нашу собственную
    if (!shortenedUrl) {
        finalShortenedUrl = cryptoRandomString({length: 7, type: 'alphanumeric'}); // Генерируем случайную строку из 7 символов
    }

    // Проверяем, не занята ли короткая ссылка
    const existingUrl = await Url.findOne({ shortenedUrl: finalShortenedUrl });

    if (existingUrl) {
        return res.status(400).json({ message: 'This shortened URL is already in use' });
    }

    // Создаем новую запись в БД
    const url = new Url({ originalUrl, shortenedUrl: finalShortenedUrl, sessionId: req.sessionID });

    await url.save();

    res.json({ originalUrl, shortenedUrl: finalShortenedUrl });
});

// Получение списка всех URL пользователя
app.get('/urls', async (req, res) => {
    const urls = await Url.find({ sessionId: req.sessionID });

    res.json(urls);
});

// Редирект
app.get('/:shortenedUrl', async (req, res) => {
    const url = await Url.findOne({ shortenedUrl: req.params.shortenedUrl });

    if (!url) {
        return res.status(404).json({ message: 'URL not found' });
    }

    res.redirect(url.originalUrl);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
