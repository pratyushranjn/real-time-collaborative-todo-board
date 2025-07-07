require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
const authRoute = require('./routes/authRoutes')

const http = require('http');
const Socket = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

connectDB();

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/user', authRoute);

// Setup Socket.IO
Socket(server);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});


app.get('/', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});