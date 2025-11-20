// index.js
// FILE: index.js
// Cloudinary credentials are now loaded from environment variables

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config();
const mongoose = require("mongoose");

// Import central routes
const apiRoutes = require("./routes");
const { generalLimiter } = require("./middleware/rateLimiter");
const {
  fileLogger,
  errorLogger,
  consoleLogger,
  captureResponseBody,
} = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const { HTTP_STATUS, ERROR_MESSAGES } = require("./utils/constants");

const app = express();
const PORT = 8080;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Connection error:", err));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(captureResponseBody);
app.use(fileLogger);
app.use(errorLogger);
app.use(consoleLogger);

app.use(generalLimiter);

// Routes
app.use("/api", apiRoutes);

// 404 handler - must be after all other routes
app.use((req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: ERROR_MESSAGES.ROUTE_NOT_FOUND,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware for multer file size errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      error.statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
      error.message = ERROR_MESSAGES.FILE_TOO_LARGE;
    }
  }
  next(error);
});

// Centralized error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
