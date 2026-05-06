const orderModel = require("../models/order.model");
const mongoose = require("mongoose");
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

/**
 * @route POST api/orders
 * @desc Create a new order
 * @access Private (user)
 * @returns { order }
 */

async function createOrderController(req, res) {
  const userId = req.user.id;
  try {
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (err) {
      return res.status(500).json({ success: false, message: "Payment provider not configured" });
    }

    const plan = String(req.body?.plan || "personal").toLowerCase();
    const amountInPaise = plan === "business" ? 999 * 100 : 399 * 100;
    const receipt = crypto.randomBytes(10).toString("hex");

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${receipt}`,
      notes: {
        plan,
        planType: "PREMIUM",
        userId,
        userEmail: req.user.email,
      },
    });

    const order = await orderModel.create({
      user: userId,
      razorpayOrderId: razorpayOrder.id,  // ✅ Fix
      price: { amount: amountInPaise, currency: "INR" },
      status: "PENDING",
      notes: {
        planType: "PREMIUM",
        userEmail: req.user.email,    
      },
    });

    return res.status(201).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,                  // ✅ Frontend ke liye
      amount: order.price.amount,
      currency: order.price.currency,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
}

async function getOrderById(req, res) {
  const userId = req.user?.id;
  const orderId = req.params?.orderId;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }
    if (order.user.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Error fetching order by ID:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order. Please try again.",
    });
  }
}

module.exports = {
  createOrderController,
  getOrderById,
};
