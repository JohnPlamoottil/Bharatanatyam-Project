const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
} = require("../services/authService");
const {
  HTTP_STATUS,
  AUTH_MESSAGES,
  ERROR_MESSAGES,
} = require("../utils/constants");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require("../utils/ApiError");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "my_secret", {
    expiresIn: "7d",
  });
};

// Register new user
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      throw new BadRequestError(AUTH_MESSAGES.EMAIL_EXISTS);
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      throw new BadRequestError(AUTH_MESSAGES.USERNAME_TAKEN);
    }

    // Create user
    const user = await createUser(username, email, password);

    // Generate token
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.CREATED).json({
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err instanceof BadRequestError) {
      return next(err);
    }
    next(new InternalServerError(ERROR_MESSAGES.REGISTRATION_ERROR));
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    if (err instanceof UnauthorizedError) {
      return next(err);
    }
    next(new InternalServerError(ERROR_MESSAGES.LOGIN_ERROR));
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user._id);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    if (err instanceof NotFoundError) {
      return next(err);
    }
    next(new InternalServerError(ERROR_MESSAGES.SERVER_ERROR));
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
