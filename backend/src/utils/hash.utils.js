const { crypto } = require("crypto");

function hashKey(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
 

module.exports = hashKey;
