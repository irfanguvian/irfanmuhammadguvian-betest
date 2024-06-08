const express = require('express');
const Database = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to database
const newDatabase = new Database();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 6060;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
