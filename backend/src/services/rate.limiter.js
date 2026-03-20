const configRateLimiter = require('../config/rateLimit.config');

async function attempt(key, config = configRateLimiter.DEFAULT_CONFIG) {

  const redis = await getClient();
  const { maxRequests, windowSeconds } = config;

  const now = Math.floor(Date.now() / 1000);
  const currentWindow = Math.floor(now / windowSeconds);
  const previousWindow = currentWindow - 1;

  const currentKey = `${key}:${currentWindow}`;
  const previousKey = `${key}:${previousWindow}`;

  // How far through the current window (0..1)
  const elapsed = (now % windowSeconds) / windowSeconds;

  // Get previous window count
  const prevCount = parseInt((await redis.get(previousKey)) ?? "0", 10);

  // Weight by how much of the previous window still overlaps
  const weightedPrev = prevCount * (1 - elapsed);

  // Get current window count before incrementing
  const currentCount = parseInt((await redis.get(currentKey)) ?? "0", 10);

  const estimatedCount = weightedPrev + currentCount;

  if (estimatedCount >= maxRequests) {

    const retryAfter = Math.ceil(windowSeconds * (1 - elapsed));

    return {
      allowed: false,
      remaining: 0,
      limit: maxRequests,
      retryAfter: Math.max(1, retryAfter),
    };

  }

  // increment counter
  await redis.multi()
    .incr(currentKey)
    .expire(currentKey, windowSeconds * 2)
    .exec();

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - estimatedCount - 1),
    limit: maxRequests,
    retryAfter: 0,
  };

}

module.exports = {
  attempt
};