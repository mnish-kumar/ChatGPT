const DEFAULT_CONFIG = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20,
  windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60
};

module.exports = {
  DEFAULT_CONFIG
};