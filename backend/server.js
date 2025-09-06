const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({path: './.env'});

const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/api/products', productsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({status: 'OK', message: 'Сервер работает!'});
});

// Test
app.get('/ping', (req, res) => {
    res.send({message: 'pong'});
});

// Error handling middleware
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Что-то пошло не так!',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📊 API доступен по адресу: http://localhost:${PORT}/api`);
});

export default app;