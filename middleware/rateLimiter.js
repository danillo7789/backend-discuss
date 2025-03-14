const rateLimit = require('express-rate-limit');

// Create a rate limiter with custom options
const createRateLimiter = (min, max, message) => {
  return rateLimit({
    windowMs: min * 60 * 1000,
    max,
    message: `Too many ${message} attempts, please try again after some minutes.`,
  });
};

// Default rate limiter (10 minutes, 500 requests)
const defaultLimiter = createRateLimiter(10, 500, 'request');

module.exports = { createRateLimiter, defaultLimiter };