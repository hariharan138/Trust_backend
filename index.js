const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  'https://trust-frontend-12.vercel.app',
  'http://localhost:3000',
  'https://localhost:8081'
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // ✅ allow cookies/auth headers
}));

// ✅ To handle preflight requests
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Check or create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Routes
const trustRoutes = require('./Routes/TrustRoutes');
const userRoute = require('./Routes/UserRoutes');
const adminRoute = require('./Routes/AdminRoutes');

app.use("/api/trust", trustRoutes);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);

// ✅ Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: true, message: "An unexpected error occurred: " + err.message, success: false });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
const connectDb = require('./Database/ConnectDB');

connectDb().then(() => {
  console.log("DB connected successfully");
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}).catch(err => console.log(err.message)); make this to allow for all 
