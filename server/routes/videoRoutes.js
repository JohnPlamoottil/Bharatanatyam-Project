const { Router } = require("express");
const { uploadVideo } = require("../config/multer");
const {
  getVideos,
  getVideosByCategory,
  uploadSingleVideo,
  uploadMultipleVideos,
  deleteVideoHandler,
} = require("../controllers/videoController");

const router = Router();

// GET routes
router.get("/", getVideos);
router.get("/:category", getVideosByCategory);

// POST routes for upload
router.post("/upload", uploadVideo.single("video"), uploadSingleVideo);
router.post(
  "/upload-multiple",
  uploadVideo.array("videos", 10),
  uploadMultipleVideos
);

// DELETE routes
router.delete("/:id", deleteVideoHandler);

module.exports = router;
