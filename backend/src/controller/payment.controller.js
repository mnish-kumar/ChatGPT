const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");
const userModel = require("../models/user.model");
const userCache = require("../cache/user.cache");
const hashSignature = require("../utils/hash.utils");
const axios = require("axios");

const logger = console;

async function createPayment(req, res) {
  try {
    const { orderId } = req.params;
    if (!orderId)
      return res.status(400).json({
        success: false,
        message: "Order ID required",
      });

    const order = await orderModel.findById(orderId);
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    // User sirf apna order access kar sake
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const payment = await paymentModel.create({
      orderId: order._id,
      razorpayOrderId: order.razorpayOrderId,
      user: req.user.id,
      price: {
        amount: order.price.amount,
        currency: order.price.currency,
      },
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      razorpayOrderId: order.razorpayOrderId,
      amount: order.price.amount,
      currency: order.price.currency,
      payment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: err.message,
    });
  }
}

async function verifyPayment(req, res) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res
      .status(500)
      .json({ success: false, message: "Payment provider not configured" });
  }

  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Idempotency check: if payment already marked COMPLETED, return success without re-processing
  const existingPayment = await paymentModel.findOne({ razorpayOrderId });
  if (existingPayment?.status === "COMPLETED") {
    return res.status(200).json({ success: true, message: "Payment already processed", payment: existingPayment });
  }

  const expectedSignature = hashSignature.expectedSignature(
    razorpayOrderId,
    razorpayPaymentId,
  );
  if (expectedSignature !== razorpaySignature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid payment signature" });
  }

  try {
    const payment = await paymentModel.findOneAndUpdate(
      { razorpayOrderId, status: "PENDING" },
      {
        $set: {
          razorpayPaymentId,
          razorpaySignature,
          status: "COMPLETED",
          rawResponse: req.body,
        },
      },
      { new: true },
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    const user = await userModel.findByIdAndUpdate(
      payment.user,
      {
        plan: {
          type: "PREMIUM",
          startDate: new Date(),
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          payment: {
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
          },
        },
      },
      { new: true },
    );

    sendPlanUpgradeEmail(user.email, user.fullname.firstname, {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      startDate: user.plan.startDate,
      expiry: user.plan.expiry,
    });

    // Invalidate cached /get-me so plan reflects instantly
    userCache.deleteUsersCache([payment.user]);

    // ✅ Order status bhi update karo
    await orderModel.findOneAndUpdate(
      { razorpayOrderId },
      { $set: { status: "COMPLETED" } },
    );

    return res
      .status(200)
      .json({ success: true, message: "Payment verified", payment });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
}

module.exports = {
  createPayment,
  verifyPayment,
};
