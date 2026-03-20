require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const initSocketServer  = require('./src/sockets/socket.server');
const httpServer = require('http').createServer(app);
const { redisClient } = require('./src/config/redis');


// Connect to the database
connectDB();

// Connect to Redis
redisClient.connect().then(() => {
    console.log("Connected to Redis");
});

// Initialize Socket Server
initSocketServer(httpServer);


// Start the server
httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})