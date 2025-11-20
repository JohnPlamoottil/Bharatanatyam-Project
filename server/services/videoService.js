const { Video } = require("../messages");
const cloudinary = require("../config/cloudinary");

async function getAllVideos() {
  const videos = await Video.find({})
    .lean()
    .limit(100)
    .select(
      "name content category cloudinaryUrl contentType originalName uploadedAt",
    );

  const processedVideos = videos.map((video) => ({
    name: video.name,
    content: video.content,
    category: video.category,
    contentType: video.contentType,
    videoUrl: video.cloudinaryUrl,
    uploadedAt: video.uploadedAt,
    _id: video._id,
  }));

  return processedVideos;
}

async function fetchVideosByCategory(category) {
  const videos = await Video.find({ category })
    .lean()
    .limit(50)
    .select(
      "name content category cloudinaryUrl contentType originalName uploadedAt",
    );

  const processedVideos = videos.map((video) => ({
    name: video.name,
    content: video.content,
    category: video.category,
    contentType: video.contentType,
    videoUrl: video.cloudinaryUrl,
    uploadedAt: video.uploadedAt,
    _id: video._id,
  }));
  return processedVideos;
}

async function uploadVideoToCloudinary(buffer, category, index = null) {
  return new Promise((resolve, reject) => {
    const publicId =
      index !== null
        ? `${category}_${Date.now()}_${index}`
        : `${category}_${Date.now()}`;

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          folder: `dance-gallery-videos/${category}`,
          public_id: publicId,
          quality: "auto:good",
          transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
          timeout: 180000,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary video upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary video upload success:", result.secure_url);
            resolve(result);
          }
        },
      )
      .end(buffer);
  });
}

async function saveVideoMetadata(
  file,
  category,
  uploadResult,
  content = "No description",
) {
  const newVideo = new Video({
    name: file.originalname || "uploaded-video",
    content: content,
    category: category,
    cloudinaryUrl: uploadResult.secure_url,
    cloudinaryPublicId: uploadResult.public_id,
    contentType: file.mimetype,
    originalName: file.originalname,
  });

  await newVideo.save();
  console.log("Video metadata saved successfully to MongoDB");
  return newVideo;
}

async function deleteVideo(id) {
  const video = await Video.findById(id);
  if (!video) {
    throw new Error("Video not found");
  }

  // Delete from Cloudinary if public_id exists
  if (video.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
        resource_type: "video",
      });
      console.log(`Deleted video from Cloudinary: ${video.cloudinaryPublicId}`);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with MongoDB deletion even if Cloudinary deletion fails
    }
  }

  // Delete from MongoDB
  await Video.findByIdAndDelete(id);
  console.log(`Deleted video from MongoDB: ${id}`);
}

module.exports = {
  getAllVideos,
  fetchVideosByCategory,
  uploadVideoToCloudinary,
  saveVideoMetadata,
  deleteVideo,
};
