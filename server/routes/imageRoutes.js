const { Router } = require("express");
const { uploadImage } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rateLimiter");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { categoryParamSchema, idParamSchema } = require("../validators/schemas");
const {
  getImages,
  getImagesByCategoryHandler,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImageHandler,
} = require("../controllers/imageController");

const router = Router();

// GET routes (public)
router.get("/", getImages);
router.get(
  "/:category",
  validate(categoryParamSchema),
  getImagesByCategoryHandler,
);

// POST routes for upload (requires authentication)
router.post(
  "/upload",
  authMiddleware,
  uploadLimiter,
  uploadImage.single("image"),
  uploadSingleImage,
);
router.post(
  "/upload-multiple",
  authMiddleware,
  uploadLimiter,
  uploadImage.array("images", 20),
  uploadMultipleImages,
);

// DELETE routes (requires admin role)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(idParamSchema),
  deleteImageHandler,
);

module.exports = router;
