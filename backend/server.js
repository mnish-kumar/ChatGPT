require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const initSocketServer  = require('./src/sockets/socket.server');
const httpServer = require('http').createServer(app);


// Connect to the database
connectDB();

// Initialize Socket Server
initSocketServer(httpServer);


// Start the server
const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ✅`);
});
