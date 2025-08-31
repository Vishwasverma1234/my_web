// GET /api/videos/my
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const myVideos = await Video.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    res.json(myVideos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
