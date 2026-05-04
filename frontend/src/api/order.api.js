import api from "../api/axios";

export const createOrder = async (orderData) => {
    try {
        const res = await api.post("/api/orders", orderData);
        return res.data;
    }catch (err) {
        throw err.response?.data || { message: err.message };
    }
}


export const getOrderById = async (orderId) => {
    try {
        const res = await api.get(`/api/orders/${orderId}`);
        return res.data;
    }
    catch (err) {
        throw err.response?.data || { message: err.message };
    }
}
