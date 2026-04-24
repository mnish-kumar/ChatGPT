const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const compression = require('compression');

/* Importing Routes */
const authRouter = require('../src/routes/auth.route');
const chatRoute = require('../src/routes/chat.route');
const orderRoute = require('../src/routes/order.route');
const paymentRoute = require('../src/routes/payment.route');

const rateLimiter = require('./middlewares/rateLimiter.middleware');


const app = express();

// trust first proxy (if behind a reverse proxy like Nginx or Heroku)
app.set('trust proxy', 1); 

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

/* Using Middlewares */
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Apply global API rate limiter to all routes
app.use(rateLimiter.globalAPIRateLimiter);


/* Using Route */
app.use('/api/auth', authRouter);
app.use('/api/chat', compression(), chatRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment', paymentRoute);

module.exports = app;