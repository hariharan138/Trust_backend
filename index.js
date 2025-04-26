const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// ✅ CORS Proper Configuration
const allowedOrigins = [
  'https://trust-frontend-12.vercel.app', // Only your frontend URL allowed
];

app.use(cors({
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

// ✅ Create uploads folder if missing
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
  console.log("✅ DB connected successfully");
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on PORT ${PORT}`);
  });
}).catch(err => console.log(err.message)); // Make this to allow for all
