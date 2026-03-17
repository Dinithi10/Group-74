const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const roomRoutes = require('./routes/roomRoutes');
const designRoutes = require('./routes/designRoutes');
const authRoutes = require('./routes/authRoutes');
const furnitureRoutes = require('./routes/furnitureRoutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('3D Furni Backend API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
