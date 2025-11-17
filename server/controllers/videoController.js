const {
  getAllVideos,
  fetchVideosByCategory,
  uploadVideoToCloudinary,
  saveVideoMetadata,
  deleteVideo,
} = require("../services/videoService");

const getVideos = async (req, res) => {
  try {
    console.log("Fetching all videos...");
    const videos = await getAllVideos();
    console.log(`Found ${videos.length} videos in database`);
    res.status(200).json({ videos });
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Unable to fetch videos" });
  }
};

const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching videos for category: ${category}`);

    const videos = await fetchVideosByCategory(category);

    res.status(200).json({ videos: videos });
  } catch (err) {
    console.error("Error fetching videos by category:", err);
    res.status(500).json({ error: "Unable to fetch videos" });
  }
};

const uploadSingleVideo = async (req, res) => {
  console.log("Single video upload request received");

  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded" });
  }

  const category = req.body.category;
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  // Check file size (100MB = 104,857,600 bytes)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (req.file.size > maxSize) {
    console.log(
      `Video file too large: ${req.file.size} bytes (${(
        req.file.size /
        1024 /
        1024
      ).toFixed(2)}MB)`
    );
    return res.status(413).json({
      error: `Video file is too large. Maximum size is 100MB, but your file is ${(
        req.file.size /
        1024 /
        1024
      ).toFixed(2)}MB. Please compress the video before uploading.`,
    });
  }

  console.log(`File size: ${(req.file.size / 1024 / 1024).toFixed(2)}MB`);
  console.log("File:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
  console.log("Body:", req.body);

  try {
    console.log(`Uploading video to Cloudinary for category: ${category}`);

    // Upload to Cloudinary
    const uploadResult = await uploadVideoToCloudinary(
      req.file.buffer,
      category
    );

    // Save video metadata to MongoDB
    await saveVideoMetadata(req.file, category, uploadResult, req.body.content);

    res.status(201).json({
      message: "Video uploaded successfully",
      videoUrl: uploadResult.secure_url,
    });
  } catch (err) {
    console.error("Error uploading video:", err);

    // Provide more specific error messages
    if (err.http_code === 413) {
      res.status(413).json({
        error:
          "Video file is too large for Cloudinary. Please compress the video to under 100MB and try again.",
      });
    } else if (err.message && err.message.includes("timeout")) {
      res.status(408).json({
        error:
          "Video upload timed out. Please try with a smaller file or check your internet connection.",
      });
    } else {
      res.status(500).json({
        error:
          "Unable to upload video. Please try again or contact support if the problem persists.",
      });
    }
  }
};

const uploadMultipleVideos = async (req, res) => {
  console.log("Multiple videos upload request received");
  console.log("Files count:", req.files?.length || 0);
  console.log("Body:", req.body);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No videos uploaded" });
  }

  const category = req.body.category;
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const results = [];
  const errors = [];
  const maxSize = 100 * 1024 * 1024; // 100MB

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    try {
      console.log(
        `Processing video ${i + 1}/${req.files.length}: ${file.originalname}`
      );

      // Check file size
      if (file.size > maxSize) {
        throw new Error(
          `File too large: ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB (max 100MB)`
        );
      }

      // Upload to Cloudinary
      const uploadResult = await uploadVideoToCloudinary(
        file.buffer,
        category,
        i
      );

      // Save video metadata to MongoDB
      await saveVideoMetadata(file, category, uploadResult, req.body.content);

      results.push({
        originalName: file.originalname,
        videoUrl: uploadResult.secure_url,
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
    message: `Processed ${req.files.length} videos`,
    successful: results.length,
    failed: errors.length,
    results: results,
    errors: errors,
  });
};

const deleteVideoHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteVideo(id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    if (err.message === "Video not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Unable to delete video" });
  }
};

module.exports = {
  getVideos,
  getVideosByCategory,
  uploadSingleVideo,
  uploadMultipleVideos,
  deleteVideoHandler,
};
