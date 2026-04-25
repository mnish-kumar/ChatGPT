import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export async function createOrder() {
    try {
        const response = await api.post(`${BASE_URL}/api/orders`);

        return response.data;
    } catch (error) {
        console.error("Create order error:", error);
        throw error.response?.data || { message: "Create order failed" };
    }
}

export async function getOrderDetails({ orderId }) {
    try {
        const response = await api.get(`${BASE_URL}/api/orders/${orderId}`);    
        return response.data;
    } catch (error) {
        console.error("Get order details error:", error);
        throw error.response?.data || { message: "Get order details failed" };
    }
}