const { Router } = require("express");
const { uploadImage } = require("../config/multer");
const {
  getImages,
  getImagesByCategoryHandler,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImageHandler,
} = require("../controllers/imageController");

const router = Router();

// GET routes
router.get("/", getImages);
router.get("/:category", getImagesByCategoryHandler);

// POST routes for upload
router.post("/upload", uploadImage.single("image"), uploadSingleImage);
router.post(
  "/upload-multiple",
  uploadImage.array("images", 20),
  uploadMultipleImages
);

// DELETE routes
router.delete("/:id", deleteImageHandler);

module.exports = router;
