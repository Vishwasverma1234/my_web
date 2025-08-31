const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const Video = require("../models/Video");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const router = express.Router();

// ✅ Supabase config
const SUPABASE_URL = "https://ygdaiuuyaqphjtwvydsj.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZGFpdXV5YXFwaGp0d3Z5ZHNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTIzNjU4NywiZXhwIjoyMDcwODEyNTg3fQ.3TVr0X0F6VMVwXPQFPIw733Go-s_Pm5vF4zjlXwOBdE";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Multer config

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Upload video
router.post("/upload", authMiddleware, upload.single("video"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const filePath = path.join(__dirname, "..", req.file.path);
    const fileBuffer = fs.readFileSync(filePath);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(`videos/${req.file.filename}`, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Supabase upload failed" });
    }

    // Public URL
    const { data: publicData } = supabase.storage
      .from("videos")
      .getPublicUrl(`videos/${req.file.filename}`);

    const videoUrl = publicData.publicUrl;

    // ✅ Ensure uploadedBy is ObjectId
    const newVideo = new Video({
      title,
      description,
      videoUrl,
      uploadedBy: new mongoose.Types.ObjectId(req.user.id),
    });

    await newVideo.save();
    fs.unlinkSync(filePath);

    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ My videos
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedBy: new mongoose.Types.ObjectId(req.user.id),
    }).sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Videos by user id
router.get("/user/:id", async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedBy: new mongoose.Types.ObjectId(req.params.id),
    }).sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Public all videos (anyone can see)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
    const skip = (page - 1) * limit;

    const q = (req.query.q || "").trim();
    const filter = q ? { title: { $regex: q, $options: "i" } } : {};

    const [items, total] = await Promise.all([
      Video.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("uploadedBy", "username"),
      Video.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      hasMore: skip + items.length < total,
      items,
    });
  } catch (err) {
    console.error("Public feed error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
