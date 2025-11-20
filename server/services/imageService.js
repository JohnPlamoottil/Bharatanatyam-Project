const { Image } = require("../messages");
const cloudinary = require("../config/cloudinary");

async function getAllImages() {
  const images = await Image.find({})
    .lean()
    .limit(100)
    .select(
      "name content category cloudinaryUrl contentType originalName uploadedAt",
    );

  const processedImages = images.map((img) => ({
    name: img.name,
    content: img.content,
    category: img.category,
    contentType: img.contentType,
    imageUrl: img.cloudinaryUrl,
    uploadedAt: img.uploadedAt,
    _id: img._id,
  }));

  return processedImages;
}

async function getImagesByCategory(category) {
  const images = await Image.find({ category })
    .lean()
    .limit(50)
    .select(
      "name content category cloudinaryUrl contentType originalName uploadedAt",
    );

  const processedImages = images.map((img) => ({
    name: img.name,
    content: img.content,
    category: img.category,
    contentType: img.contentType,
    imageUrl: img.cloudinaryUrl,
    uploadedAt: img.uploadedAt,
    _id: img._id,
  }));

  return processedImages;
}

async function uploadImageToCloudinary(
  compressedBuffer,
  category,
  index = null,
) {
  return new Promise((resolve, reject) => {
    const publicId =
      index !== null
        ? `${category}_${Date.now()}_${index}`
        : `${category}_${Date.now()}`;

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: `dance-gallery/${category}`,
          public_id: publicId,
          quality: "auto:good",
          fetch_format: "auto",
          flags: "keep_attribution",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", result.secure_url);
            resolve(result);
          }
        },
      )
      .end(compressedBuffer);
  });
}

async function saveImageMetadata(
  file,
  category,
  uploadResult,
  content = "No description",
) {
  const newImage = new Image({
    name: file.originalname || "uploaded-image",
    content: content,
    category: category,
    cloudinaryUrl: uploadResult.secure_url,
    cloudinaryPublicId: uploadResult.public_id,
    contentType: file.mimetype,
    originalName: file.originalname,
  });

  await newImage.save();
  console.log("Image metadata saved successfully to MongoDB");
  return newImage;
}

async function deleteImage(id) {
  const image = await Image.findById(id);
  if (!image) {
    throw new Error("Image not found");
  }

  // Delete from Cloudinary if public_id exists
  if (image.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(image.cloudinaryPublicId);
      console.log(`Deleted image from Cloudinary: ${image.cloudinaryPublicId}`);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with MongoDB deletion even if Cloudinary deletion fails
    }
  }

  // Delete from MongoDB
  await Image.findByIdAndDelete(id);
  console.log(`Deleted image from MongoDB: ${id}`);
}

module.exports = {
  getAllImages,
  getImagesByCategory,
  uploadImageToCloudinary,
  saveImageMetadata,
  deleteImage,
};
