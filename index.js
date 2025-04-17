const express = require('express');
const mongoose = require('mongoose');
let app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://trust-frontend-12.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true // if you use cookies or authentication
}));
app.use(cookieParser())

const trustRoutes = require('./Routes/TrustRoutes');
const userRoute = require('./Routes/UserRoutes');
const adminRoute = require('./Routes/AdminRoutes');
const connectDb  = require('./Database/ConnectDB');

const fs = require("fs")
const path = require("path")

app.use(express.json())

const uploadsDir = path.join(__dirname, 'uploads');

// Check if the folder exists, and create it if it doesn't
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use("/api/trust", trustRoutes)
app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: true, message: "An unexpected error occurred: " + err.message, success: false });
});

const PORT = process.env.PORT || 4000;

connectDb().then(() => {
    console.log("DB connected successfully")
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on PORT ${PORT}`)
    })
}).catch(err=> console.log(err.message))
