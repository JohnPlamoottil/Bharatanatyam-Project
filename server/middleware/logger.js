const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log the directory path for debugging
console.log("Logs directory:", logsDir);

// Create a write stream for the log file with immediate flush
const logFilePath = path.join(logsDir, "requests.log");
const accessLogStream = fs.createWriteStream(logFilePath, {
  flags: "a",
  encoding: "utf8",
  autoClose: false, // Keep stream open
});

// Create a write stream for error logs
const errorLogFilePath = path.join(logsDir, "error.log");
const errorLogStream = fs.createWriteStream(errorLogFilePath, {
  flags: "a",
  encoding: "utf8",
  autoClose: false,
});

// Handle stream errors
accessLogStream.on("error", (err) => {
  console.error("Error writing to log file:", err);
});

errorLogStream.on("error", (err) => {
  console.error("Error writing to error log file:", err);
});

// Test write to verify stream is working
accessLogStream.write(
  `\n--- Logger initialized at ${new Date().toISOString()} ---\n`
);
errorLogStream.write(
  `\n--- Error logger initialized at ${new Date().toISOString()} ---\n`
);

console.log("Log file path:", logFilePath);
console.log("Error log file path:", errorLogFilePath);

// Custom token for response body (limited to prevent large logs)
morgan.token("res-body", (req, res) => {
  if (res.locals.body) {
    const body = JSON.stringify(res.locals.body);
    return body.length > 500 ? body.substring(0, 500) + "..." : body;
  }
  return "-";
});

// Custom token for request body (limited to prevent large logs)
morgan.token("req-body", (req) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const body = JSON.stringify(req.body);
    return body.length > 500 ? body.substring(0, 500) + "..." : body;
  }
  return "-";
});

// Custom format with detailed information
const logFormat = [
  ":date[iso]",
  ":method :url",
  "HTTP/:http-version",
  "Status: :status",
  "Response Time: :response-time ms",
  "Content Length: :res[content-length]",
  "- :remote-addr",
  "User Agent: :user-agent",
  "Request Body: :req-body",
].join(" | ");

// Middleware to log requests to file with immediate write
const fileLogger = morgan(logFormat, {
  stream: {
    write: (message) => {
      accessLogStream.write(message);
      // Force flush to disk
      if (accessLogStream.flush) {
        accessLogStream.flush();
      }
    },
  },
});

// Middleware to log errors (4xx and 5xx status codes) to error.log
const errorLogger = morgan(logFormat, {
  stream: {
    write: (message) => {
      errorLogStream.write(message);
      if (errorLogStream.flush) {
        errorLogStream.flush();
      }
    },
  },
  skip: (req, res) => res.statusCode < 400, // Only log errors
});

// Middleware to log requests to console (simpler format for development)
const consoleLogger = morgan("dev");

// Middleware to capture response body for logging
const captureResponseBody = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    res.locals.body = data;
    originalSend.call(this, data);
  };

  next();
};

module.exports = {
  fileLogger,
  errorLogger,
  consoleLogger,
  captureResponseBody,
};
