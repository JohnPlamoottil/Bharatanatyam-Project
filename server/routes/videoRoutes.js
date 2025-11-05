import { Router } from "express";
import { getVideosByCategory } from "../controllers/videoController";
const router = Router();

router.get("/api/videos/:category", getVideosByCategory);

export default router;
