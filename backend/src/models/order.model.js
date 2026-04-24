const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    price: {
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ["USD", "INR"],
            default: "INR",
        }
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED", "CREATED", "CANCELED"],
        default: "PENDING",
    },
    notes: {
        planType: String,
        userMail: String,
    }

});


const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;