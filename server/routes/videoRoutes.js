const { Router } = require("express");
const { uploadVideo } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rateLimiter");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { categoryParamSchema, idParamSchema } = require("../validators/schemas");
const {
  getVideos,
  getVideosByCategory,
  uploadSingleVideo,
  uploadMultipleVideos,
  deleteVideoHandler,
} = require("../controllers/videoController");

const router = Router();

// GET routes (public)
router.get("/", getVideos);
router.get("/:category", validate(categoryParamSchema), getVideosByCategory);

// POST routes for upload (requires authentication)
router.post(
  "/upload",
  authMiddleware,
  uploadLimiter,
  uploadVideo.single("video"),
  uploadSingleVideo,
);
router.post(
  "/upload-multiple",
  authMiddleware,
  uploadLimiter,
  uploadVideo.array("videos", 10),
  uploadMultipleVideos,
);

// DELETE routes (requires admin role)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(idParamSchema),
  deleteVideoHandler,
);

module.exports = router;
