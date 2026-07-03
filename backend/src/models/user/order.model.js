const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ["USD", "INR"],
            required: true,
        }
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "CREATED", "CANCELED"],
        default: "PENDING",
    },
    notes: {
        planType: String,
        userEmail: String,
    }

}, { timestamps: true });


const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;