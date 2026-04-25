const orderModel = require("../models/order.model");
const mongoose = require("mongoose");


/**
 * @route POST api/orders
 * @desc Create a new order
 * @access Private (user)
 * @returns { order }
 */

async function createOrderController(req, res) {
    const userId = req.user.id;

    try {
        const planPrice = 499;
        const totalAmountInPaise = planPrice * 100;

        const order = await orderModel.create({
            user: userId,
            price: {
                amount: totalAmountInPaise,
                currency: "INR",
            },
            status: "PENDING",
            notes: {
                planType: "PREMIUM",
                userEmail: req.user.email,
            }
        });


        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
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