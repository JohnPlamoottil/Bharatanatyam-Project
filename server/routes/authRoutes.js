const { Router } = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");
const { strictLimiter } = require("../middleware/rateLimiter");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/schemas");

const router = Router();

// Public routes with strict rate limiting
router.post("/signup", strictLimiter, validate(registerSchema), register);
router.post("/signin", strictLimiter, validate(loginSchema), login);

// Protected routes
router.get("/users/me", authMiddleware, getProfile);

module.exports = router;
