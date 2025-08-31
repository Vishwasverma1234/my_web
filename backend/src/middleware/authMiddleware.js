const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: new mongoose.Types.ObjectId(decoded.id), // ✅ always ObjectId
      username: decoded.username
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
