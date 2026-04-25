const rateLimit = require("express-rate-limit");

const emergencyRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again shortly.",
  },
});

module.exports = emergencyRateLimiter;
