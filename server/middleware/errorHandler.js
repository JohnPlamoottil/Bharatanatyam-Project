const fs = require("fs");
const path = require("path");
const { ApiError } = require("../utils/ApiError");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create error log stream
const errorLogPath = path.join(logsDir, "error.log");
const errorLogStream = fs.createWriteStream(errorLogPath, {
  flags: "a",
  encoding: "utf8",
});

// Legacy AppError for backward compatibility
class AppError extends ApiError {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

// Log error to file
const logErrorToFile = (err, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    error: {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
    },
    body: req.body,
  };

  errorLogStream.write(JSON.stringify(errorLog, null, 2) + "\n\n");
};

// Centralized error handler middleware
const errorHandler = (err, req, res, _next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log error to file
  logErrorToFile(err, req);

  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      url: req.originalUrl,
    });
  }

  // Send error response
  const response = {
    error: err.message,
    ...(err.errors && { errors: err.errors }), // Include validation errors if present
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };

  res.status(err.statusCode).json(response);
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    type: "Unhandled Promise Rejection",
    reason: reason,
    promise: promise,
  };
  errorLogStream.write(JSON.stringify(errorLog, null, 2) + "\n\n");
  console.error("Unhandled Promise Rejection:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    type: "Uncaught Exception",
    error: {
      message: err.message,
      stack: err.stack,
    },
  };
  errorLogStream.write(JSON.stringify(errorLog, null, 2) + "\n\n");
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = {
  AppError,
  errorHandler,
};
