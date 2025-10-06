const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: './.env' });
const prometheusConfig = require('./config');
const { register, httpRequestCounter, responseTimeHistogram } = prometheusConfig;
const productsRoutes = require('./routes/products');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  const end = responseTimeHistogram.startTimer();
  res.on('finish', () => {
    const routePath = req.route?.path || req.originalUrl || req.path;

    httpRequestCounter.inc({
      method: req.method,
      route: routePath,
      status: res.statusCode
    });

    end({
      method: req.method,
      route: routePath,
      status: res.statusCode
    });
  });
  next();
});

app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// Middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Сервер работает!' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Что-то пошло не так!',
    message: err.message
  });
});

app.listen(PORT, () => {
  const filePath = path.join(__dirname, 'package.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`📊 API Version:${data.version}`);
});
