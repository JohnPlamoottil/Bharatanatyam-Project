const multer = require("multer");

// Multer setup for file upload with size limits
const storage = multer.memoryStorage();

// Different upload configs for images vs videos
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
});

const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos (Cloudinary free tier limit)
  },
});

module.exports = { uploadImage, uploadVideo };
