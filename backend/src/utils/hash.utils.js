const crypto  = require("crypto");

function hashKey(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashToken(refreshToken) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}
 

module.exports = {
  hashKey,
  hashToken
};
