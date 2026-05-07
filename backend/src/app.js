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

require('../src/crons/crons.PlanExpiry');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // OAuth redirects ke liye
}));

app.set('trust proxy', 1);


const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.length === 0) {
      return callback(new Error("CORS: FRONTEND_URL not configured"), false);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: Origin not allowed: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(rateLimiter.globalAPIRateLimiter);

/* Routes */
app.use('/api/auth', authRouter);
app.use('/api/chat', compression(), chatRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/auth/2fa', twoFA_Route);
app.use('/api/auth', resetPasswordRoute);
app.use('/api/resume', resumeRoute);

module.exports = app;