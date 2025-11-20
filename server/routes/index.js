const { Router } = require("express");
const { uploadImage, uploadVideo } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rateLimiter");

// Import route modules
const authRoutes = require("./authRoutes");
const messageRoutes = require("./messageRoutes");
const imageRoutes = require("./imageRoutes");
const videoRoutes = require("./videoRoutes");

// Import controllers for backward compatibility
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("../controllers/imageController");
const {
  uploadSingleVideo,
  uploadMultipleVideos,
} = require("../controllers/videoController");

const router = Router();

// Main routes
router.use("/auth", authRoutes);
router.use("/message", messageRoutes);
router.use("/images", imageRoutes);
router.use("/videos", videoRoutes);

// Backward compatibility routes (redirect old endpoints to new modular routes)
router.post(
  "/upload",
  uploadLimiter,
  uploadImage.single("image"),
  uploadSingleImage,
);
router.post(
  "/upload-multiple",
  uploadLimiter,
  uploadImage.array("images", 20),
  uploadMultipleImages,
);
router.post(
  "/upload-video",
  uploadLimiter,
  uploadVideo.single("video"),
  uploadSingleVideo,
);
router.post(
  "/upload-multiple-videos",
  uploadLimiter,
  uploadVideo.array("videos", 10),
  uploadMultipleVideos,
);

module.exports = router;
