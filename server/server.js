const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const ownerRouter = require("./routes/ownerRoutes");
const adminRouter = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DineSync API!"
    });
});

app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/owner', ownerRouter);

// Temporary test route
app.get('/api/admin/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin route is reachable'
    });
});

app.use('/api/admin', adminRouter);


// Start server after connecting to MongoDB
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`DineSync server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();