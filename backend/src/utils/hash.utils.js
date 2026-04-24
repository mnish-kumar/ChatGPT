const crypto  = require("crypto");

function hashKey(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashToken(refreshToken) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}

function expectedSignature(razorpayOrderId, razorpayPaymentId) {
  if (!razorpayOrderId || !razorpayPaymentId) {
    throw new Error("Missing required fields for signature generation"); 
  }

  return crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
}
 

module.exports = {
  hashKey,
  hashToken,
  expectedSignature,
};
