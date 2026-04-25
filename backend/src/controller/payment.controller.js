const paymentModel = require("../models/payment.model");
const hashSignature = require("../utils/hash.utils");
const orderModel = require("../models/order.model");
const axios = require('axios');
const Razorpay = require("razorpay");
const crypto = require("crypto");


let razorpayClient;
function getRazorpayClient() {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys are not configured (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET)",
    );
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  return razorpayClient;
}

async function createPayment(req, res) {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  

  try {
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Payment provider is not configured",
      });
    }
    
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing orderId parameter",
      });
    }

    const orderResponse = await axios.get(`http://localhost:3000/api/orders/${orderId}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });

    const receipt = crypto.randomBytes(10).toString("hex");

    const price = orderResponse.data.order.price;
    const amountInPaise = price.amount;
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: price.currency,
      receipt: `receipt_${receipt}`,
    });

    const payment = await paymentModel.create({
      orderId: orderId,
      razorpayOrderId: order.id,
      user: req.user.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Payment initialized successfully",
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      payment,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err?.message;
    return res.status(status).json({
      success: false,
      message: "Failed to create payment",
      error: details,
    });
  }
}

async function verifyPayment(req, res) {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  
  if (!process.env.RAZORPAY_KEY_SECRET) {
    logger.error("Razorpay secret not configured", {
      route: "verifyPayment",
      userId: req.user?.id,
    });
    return res.status(500).json({
      success: false,
      message: "Payment provider is not configured",
    });
  }

  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    console.warn("verifyPayment missing required fields", {
      route: "verifyPayment",
      userId: req.user?.id,
    });
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Verify the HMAC payment signature
  const expectedSignature = hashSignature.expectedSignature(razorpayOrderId, razorpayPaymentId);

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  try {

    const payment = await paymentModel.findOneAndUpdate(
      { razorpayOrderId, status: "PENDING" },
      {
        $set: {
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignature,
          status: "COMPLETED",
        },
      },
      { new: true },
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
}

module.exports = {
  createPayment,
  verifyPayment,
};
