const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ Added
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// ✅ NEW: For video upload
const videoRoutes = require("./routes/videoRoutes");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Enable CORS for frontend
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ NEW: Video upload routes
app.use("/api/videos", videoRoutes);

// ✅ NEW: Serve uploaded videos folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Protected route example
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}, you accessed a protected route!` });
});

// ✅ Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
