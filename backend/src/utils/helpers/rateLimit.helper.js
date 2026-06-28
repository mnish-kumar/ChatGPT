function getClientIP(req) {
  if (req.ip) return req.ip;

  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = (Array.isArray(forwardedFor) ? forwardedFor.join(",") : forwardedFor)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return ips[ips.length - 1]; // last IP = infra added, not spoofable
  }

  return req.socket?.remoteAddress || "unknown_ip"; // req.connection deprecated
}


function toManyRequest(res, rlError, message) {
  const retryAfterSeconds = rlError?.msBeforeNext
    ? Math.ceil(rlError.msBeforeNext / 1000)
    : 60;

  return res
    .status(429)
    .set("Retry-After", String(retryAfterSeconds))
    .json({
      success: false,
      message,
      retryAfter: retryAfterSeconds,
    });
}

module.exports = { getClientIP, toManyRequest };