// index.js
// FILE: index.js
// Cloudinary credentials are now loaded from environment variables

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config();
const mongoose = require("mongoose");

// Import routes
const messageRoutes = require("./routes/messageRoutes");
const imageRoutes = require("./routes/imageRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();
const PORT = 8080;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/message", messageRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/videos", videoRoutes);

// Backward compatibility routes (redirect old endpoints to new modular routes)
const { uploadImage, uploadVideo } = require("./config/multer");
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("./controllers/imageController");
const {
  uploadSingleVideo,
  uploadMultipleVideos,
} = require("./controllers/videoController");

app.post("/api/upload", uploadImage.single("image"), uploadSingleImage);
app.post(
  "/api/upload-multiple",
  uploadImage.array("images", 20),
  uploadMultipleImages
);
app.post("/api/upload-video", uploadVideo.single("video"), uploadSingleVideo);
app.post(
  "/api/upload-multiple-videos",
  uploadVideo.array("videos", 10),
  uploadMultipleVideos
);

// Error handling middleware for multer file size errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error:
          "File too large. Images must be under 10MB and videos must be under 100MB.",
      });
    }
  }
  next(error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
