const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AUTH_MESSAGES } = require("../utils/constants");
const { UnauthorizedError, ForbiddenError } = require("../utils/ApiError");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_REQUIRED);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "my_secret");

    // Find user by id
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    if (err instanceof UnauthorizedError) {
      return next(err);
    }
    next(new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN));
  }
};

// Admin-only middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new ForbiddenError(AUTH_MESSAGES.UNAUTHORIZED_ACCESS));
  }
};

module.exports = { authMiddleware, adminMiddleware };
