import { fetchVideosByCategory } from "../services/videoService";

const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching videos for category: ${category}`);

    const videos = fetchVideosByCategory(category);

    res.status(200).json({ videos: videos });
  } catch (err) {
    console.error("Error fetching videos by category:", err);
    res.status(500).json({ error: "Unable to fetch videos" });
  }
};

export { getVideosByCategory };
