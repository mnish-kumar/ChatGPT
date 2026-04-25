import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export async function createPayment({ orderId }) {
    try {
        const response = await api.post(`${BASE_URL}/api/payment/created`, { orderId });
        return response.data;
    } catch (error) {
        console.error("Create payment error:", error);
        throw error.response?.data || { message: "Create payment failed" };
    }
}


export async function verifyPayment({ paymentData }) {
    try {
        const response = await api.post(`${BASE_URL}/api/payment/verify`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Verify payment error:", error);
        throw error.response?.data || { message: "Verify payment failed" };
    }
}

