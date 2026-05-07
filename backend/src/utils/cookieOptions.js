function getCookieOptions(req) {
  const forwardedProto = req?.get?.("x-forwarded-proto");
  const isHttps = req?.secure === true || forwardedProto === "https";

  const secure = isHttps || process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "None" : "Lax",
  };
}

module.exports = {
  getCookieOptions,
};
