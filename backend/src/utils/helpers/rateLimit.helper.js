
function getClientIP(req) {
  if (req.ip) {
    return req.ip;
  }

  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = (Array.isArray(forwardedFor) ? forwardedFor.join(",") : forwardedFor)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    // Last IP = added by your infra, not spoofable by the client
    return ips[ips.length - 1];
  }

  return req.connection?.remoteAddress || "unknown_ip";
}

function toManyRequest(res, message, rlError) {
  const retryAfterSeconds = rlError?.msBeforeNext
    ? Math.ceil(rlError.msBeforeNext / 1000)
    : 60;

  return res.status(429).set("Retry-After", String(retryAfterSeconds)).json({
    success: false,
    message,
    retryAfter: retryAfterSeconds,
  });
}


module.exports = {
    getClientIP,
    toManyRequest,
};