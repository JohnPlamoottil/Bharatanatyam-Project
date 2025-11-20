// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Authentication Messages
const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  EMAIL_EXISTS: "Email already registered",
  USERNAME_TAKEN: "Username already taken",
  INVALID_CREDENTIALS: "Invalid credentials",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  TOKEN_REQUIRED: "Authorization token required",
  INVALID_TOKEN: "Invalid or expired token",
  USER_NOT_FOUND: "User not found",
};

// Error Messages
const ERROR_MESSAGES = {
  SERVER_ERROR: "Internal server error",
  REGISTRATION_ERROR: "Server error during registration",
  LOGIN_ERROR: "Server error during login",
  ROUTE_NOT_FOUND: "Route not found",
  VALIDATION_ERROR: "Validation error",
  FILE_TOO_LARGE:
    "File too large. Images must be under 10MB and videos must be under 100MB.",
  NO_FILE_UPLOADED: "No file uploaded",
  UPLOAD_FAILED: "File upload failed",
  DELETE_FAILED: "Failed to delete resource",
  FETCH_FAILED: "Failed to fetch resource",
  UPDATE_FAILED: "Failed to update resource",
  INVALID_REQUEST: "Invalid request",
  DATABASE_ERROR: "Database operation failed",
};

// Message/Guestbook Messages
const MESSAGE_MESSAGES = {
  CREATE_SUCCESS: "Message created successfully",
  FETCH_SUCCESS: "Messages retrieved successfully",
  DELETE_SUCCESS: "Message deleted successfully",
  UPDATE_SUCCESS: "Message updated successfully",
  MESSAGE_NOT_FOUND: "Message not found",
  CONTENT_REQUIRED: "Message content is required",
  NAME_REQUIRED: "Name is required",
};

// Image Messages
const IMAGE_MESSAGES = {
  UPLOAD_SUCCESS: "Image uploaded successfully",
  UPLOAD_MULTIPLE_SUCCESS: "Images uploaded successfully",
  DELETE_SUCCESS: "Image deleted successfully",
  FETCH_SUCCESS: "Images retrieved successfully",
  IMAGE_NOT_FOUND: "Image not found",
  INVALID_CATEGORY: "Invalid image category",
};

// Video Messages
const VIDEO_MESSAGES = {
  UPLOAD_SUCCESS: "Video uploaded successfully",
  UPLOAD_MULTIPLE_SUCCESS: "Videos uploaded successfully",
  DELETE_SUCCESS: "Video deleted successfully",
  FETCH_SUCCESS: "Videos retrieved successfully",
  VIDEO_NOT_FOUND: "Video not found",
  INVALID_CATEGORY: "Invalid video category",
};

// Rate Limiting Messages
const RATE_LIMIT_MESSAGES = {
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  TOO_MANY_ATTEMPTS: "Too many attempts, please try again later",
};

// Validation Messages
const VALIDATION_MESSAGES = {
  INVALID_EMAIL: "Invalid email format",
  INVALID_PASSWORD: "Password must be at least 6 characters long",
  PASSWORDS_NOT_MATCH: "Passwords do not match",
  INVALID_USERNAME: "Username must be at least 3 characters long",
  REQUIRED_FIELD: "This field is required",
};

module.exports = {
  HTTP_STATUS,
  AUTH_MESSAGES,
  ERROR_MESSAGES,
  MESSAGE_MESSAGES,
  IMAGE_MESSAGES,
  VIDEO_MESSAGES,
  RATE_LIMIT_MESSAGES,
  VALIDATION_MESSAGES,
};
