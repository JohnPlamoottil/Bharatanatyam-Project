import { Video } from "../messages";

export async function fetchVideosByCategory(category) {
  const videos = await Video.find({ category })
    .lean()
    .limit(50)
    .select(
      "name content category cloudinaryUrl contentType originalName uploadedAt"
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
