function getCookieOptions(req) {
  const forwardedProto = req?.get?.("x-forwarded-proto");
  const isHttps = req?.secure === true || forwardedProto === "https";
  const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

  // In development with localhost, allow cookies across ports
  // In production, use strict security settings
  const secure = isHttps || (process.env.NODE_ENV === "production");
  const sameSite = isDevelopment ? "Lax" : (secure ? "None" : "Lax");

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
}

module.exports = {
  getCookieOptions,
};
