const cookieParser = require('cookie-parser');
const express = require('express');

/* Importing Routes */
const authRouter = require('../src/routes/auth.route');
const chatRoute = require('../src/routes/chat.route');


const app = express();

/* Using Middlewares */
app.use(express.json());
app.use(cookieParser());


/* Using Route */
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRoute);



module.exports = app;