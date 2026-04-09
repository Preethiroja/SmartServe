const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();

// 2. Database Connection
connectDB();

// 3. Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 4. Route Mapping
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/complaints', complaintRoutes); // 👈 This maps to http://localhost:5000/api/complaints

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));