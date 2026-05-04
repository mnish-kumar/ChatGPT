import api from "../api/axios";

export async function initializePayment(orderId) {
    try {
        const res = await api.post(`/api/payment/created/${orderId}`);
        return res.data;
    }catch (err) {
        throw err.response?.data || { message: err.message };
    }
}

export async function verifyPayment({ razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
    try {
        const res = await api.post("/api/payment/verify", { razorpayPaymentId, razorpayOrderId, razorpaySignature });
        return res.data;
    }catch (err) {
        throw err.response?.data || { message: err.message };
    }
}