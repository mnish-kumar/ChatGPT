const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

/* Importing Routes */
const authRouter = require('../src/routes/auth.route');
const chatRoute = require('../src/routes/chat.route');


const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

/* Using Middlewares */
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


/* Using Route */
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRoute);



module.exports = app;