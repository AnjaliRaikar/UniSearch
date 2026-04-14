require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const collegeRoutes = require('./routes/colleges');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/colleges', collegeRoutes);

// Serve static files (frontend)
app.use(express.static('.'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});