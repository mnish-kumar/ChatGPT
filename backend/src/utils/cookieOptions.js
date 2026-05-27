function getCookieOptions(req) {
  const forwardedProto = req?.get?.("x-forwarded-proto");
  const isHttps = req?.secure === true || forwardedProto === "https";

  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };
}

module.exports = {
  getCookieOptions,
};
