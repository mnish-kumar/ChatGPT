const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const passport = require('./config/passport');

/* Importing Routes */
const authRouter = require('../src/routes/auth.route');
const chatRoute = require('../src/routes/chat.route');
const orderRoute = require('../src/routes/order.route');
const paymentRoute = require('../src/routes/payment.route');
const twoFA_Route = require('../src/routes/2FA.route');
const resetPasswordRoute = require('../src/routes/resetPassword.route');
const resumeRoute = require('../src/routes/resume.route');
const rateLimiter = require('./middlewares/rateLimiter.middleware');


// Cron jobs plan expiration check
require('../src/crons/crons.PlanExpiry');


const app = express();

// Set security-related HTTP headers using Helmet
app.use(helmet());

// trust first proxy (if behind a reverse proxy like Nginx or Heroku)
app.set('trust proxy', 1); 

// Initialize Passport for authentication
app.use(passport.initialize());

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser requests (like curl/postman) with no Origin.
        if (!origin) return callback(null, true);

        // If env is not configured, fail closed in production.
        if (allowedOrigins.length === 0) {
            return callback(new Error("CORS: FRONTEND_URL not configured"), false);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS: Origin not allowed: ${origin}`), false);
    },
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
app.use('/api/auth/2fa', twoFA_Route);
app.use('/api/auth', resetPasswordRoute);
app.use('/api/resume', resumeRoute);

module.exports = app;