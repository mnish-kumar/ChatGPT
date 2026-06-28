const socketRateLimiterConfig = require("../config/rateLimiter.config");

function extractSocketIP(socket) {
  let ip;

  const forwarded = socket.handshake.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = forwarded
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    ip = ips[ips.length - 1]; // last IP = infra added, not spoofable
  }
  ip = ip || socket.handshake.address || socket.conn.remoteAddress;

  if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";
  if (ip?.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

  return ip || "unknown";
}

async function consumeSocketIPRateLimit(socket, next) {
  const ip = extractSocketIP(socket);

  await Promise.all([
    socketIPLimiterMinute.consume(ip),
    socketIPLimiterHour.consume(ip),
  ]);
}

async function checkSocketIPBlocked(socket) {
  const ip = extractSocketIP(socket);

  const [minute, hour] = await Promise.all([
    socketRateLimiterConfig.socketIPLimiterMinute.get(ip),
    socketRateLimiterConfig.socketIPLimiterHour.get(ip),
  ]);

  if (minute?.remainingPoints <= 0 || hour?.remainingPoints <= 0) {
    const retryAfter = Math.ceil(
      Math.max(minute?.msBeforeNext || 0, hour?.msBeforeNext || 0) / 1000,
    );
    throw { msBeforeNext: retryAfter * 1000 };
  }
}

async function consumeUserChatLimit(userId, plan) {
  const limiters =
    plan === "PREMIUM"
      ? [
          socketRateLimiterConfig.chatPremiumLimiterMinute,
          socketRateLimiterConfig.chatPremiumLimiterHour,
          socketRateLimiterConfig.chatPremiumLimiterDay,
        ]
      : [
          socketRateLimiterConfig.chatFreeLimiterMinute,
          socketRateLimiterConfig.chatFreeLimiterHour,
          socketRateLimiterConfig.chatFreeLimiterDay,
        ];
  await Promise.all(limiters.map((limiter) => limiter.consume(userId)));
}

async function getRemainingQuota(userId, plan) {
  try {
    const isPremium = plan === "PREMIUM";

    const [min, hour, day] = await Promise.all([
      isPremium
        ? socketRateLimiterConfig.chatPremiumLimiterMinute.get(userId)
        : socketRateLimiterConfig.chatFreeLimiterMinute.get(userId),
      isPremium
        ? socketRateLimiterConfig.chatPremiumLimiterHour.get(userId)
        : socketRateLimiterConfig.chatFreeLimiterHour.get(userId),
      isPremium
        ? socketRateLimiterConfig.chatPremiumLimiterDay.get(userId)
        : socketRateLimiterConfig.chatFreeLimiterDay.get(userId),
    ]);

    const limits = isPremium
      ? { minute: 60, hour: 500, day: 2000 }
      : { minute: 15, hour: 100, day: 500 };

    return {
      minute: limits.minute - (min?.consumedPoints || 0),
      hour: limits.hour - (hour?.consumedPoints || 0),
      day: limits.day - (day?.consumedPoints || 0),
    };
  } catch (err) {
    return null; // In case of error, return null to indicate that the quota couldn't be determined
  }
}

function getRetryAfter(err) {
  return Math.ceil((err?.msBeforeNext || 60000) / 1000);
}

module.exports = {
  consumeSocketIPRateLimit,
  consumeUserChatLimit,
  getRemainingQuota,
  getRetryAfter,
  checkSocketIPBlocked,
};
