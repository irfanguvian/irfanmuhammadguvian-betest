const express = require('express');
const Connection = require('./config/connection');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to database
const connection = new Connection()

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));


exports.redisClient = connection.clientRedis
