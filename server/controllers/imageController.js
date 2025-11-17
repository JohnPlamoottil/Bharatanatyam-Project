const sharp = require("sharp");
const {
  getAllImages,
  getImagesByCategory,
  uploadImageToCloudinary,
  saveImageMetadata,
  deleteImage,
} = require("../services/imageService");

const getImages = async (req, res) => {
  try {
    console.log("Fetching all images...");
    const images = await getAllImages();
    console.log(`Found ${images.length} images in database`);
    res.status(200).json({ images });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Unable to fetch images" });
  }
};

const getImagesByCategoryHandler = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching images for category: ${category}`);
    const images = await getImagesByCategory(category);
    res.status(200).json({ images });
  } catch (err) {
    console.error("Error fetching images by category:", err);
    res.status(500).json({ error: "Unable to fetch images" });
  }
};

const uploadSingleImage = async (req, res) => {
  console.log("Single image upload request received");
  console.log("File:", req.file);
  console.log("Body:", req.body);

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const category = req.body.category;
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  try {
    // Compress image to optimize for Cloudinary upload with EXIF orientation handling
    let quality = 80;
    let compressedBuffer;

    // Try progressively lower qualities until under 2MB
    for (let i = 0; i < 5; i++) {
      compressedBuffer = await sharp(req.file.buffer)
        .rotate() // This automatically rotates the image based on EXIF orientation data
        .resize({ width: 1200 }) // resize to reduce pixels if needed
        .jpeg({ quality })
        .toBuffer();

      if (compressedBuffer.length <= 2 * 1024 * 1024) break; // under 2MB
      quality -= 10; // reduce quality and try again
    }

    console.log(`Uploading image to Cloudinary for category: ${category}`);

    // Upload to Cloudinary
    const uploadResult = await uploadImageToCloudinary(
      compressedBuffer,
      category
    );

    // Save image metadata to MongoDB
    await saveImageMetadata(req.file, category, uploadResult, req.body.content);

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Unable to upload image" });
  }
};

const uploadMultipleImages = async (req, res) => {
  console.log("Multiple images upload request received");
  console.log("Files count:", req.files?.length || 0);
  console.log("Body:", req.body);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  const category = req.body.category;
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const results = [];
  const errors = [];

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    try {
      console.log(
        `Processing image ${i + 1}/${req.files.length}: ${file.originalname}`
      );

      // Compress image
      let quality = 80;
      let compressedBuffer;

      for (let j = 0; j < 5; j++) {
        compressedBuffer = await sharp(file.buffer)
          .rotate()
          .resize({ width: 1200 })
          .jpeg({ quality })
          .toBuffer();

        if (compressedBuffer.length <= 2 * 1024 * 1024) break;
        quality -= 10;
      }

      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(
        compressedBuffer,
        category,
        i
      );

      // Save image metadata to MongoDB
      await saveImageMetadata(file, category, uploadResult, req.body.content);

      results.push({
        originalName: file.originalname,
        imageUrl: uploadResult.secure_url,
        success: true,
      });
    } catch (err) {
      console.error(`Error uploading ${file.originalname}:`, err);
      errors.push({
        originalName: file.originalname,
        error: err.message || "Upload failed",
        success: false,
      });
    }
  }

  res.status(201).json({
    message: `Processed ${req.files.length} images`,
    successful: results.length,
    failed: errors.length,
    results: results,
    errors: errors,
  });
};

const deleteImageHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteImage(id);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    if (err.message === "Image not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Unable to delete image" });
  }
};

module.exports = {
  getImages,
  getImagesByCategoryHandler,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImageHandler,
};
