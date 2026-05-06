import { useDispatch } from "react-redux";
import { setPremium } from "@/store/reducers/userSlice";
import { createOrder } from "@/api/order.api";
import { initializePayment, verifyPayment } from "@/api/paymnet.api";
import { checkAuth } from "@/store/userAction"; // ← add karo

export const useRazorpay = () => {
  const dispatch = useDispatch();

  const openCheckout = async ({ plan = "personal" } = {}) => {
    try {
      const orderData = await createOrder({ plan });
      const { razorpayOrderId, orderId, amount, currency, keyId } = orderData;

      await initializePayment(orderId);

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "JarviSync",
        description: "Premium Plan - 30 Days",
        order_id: razorpayOrderId,

        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Optimistic UI update (instant)
            dispatch(setPremium());

            // Sync with backend (plan + expiry from DB)
            await dispatch(checkAuth());

            alert("🎉 Premium activated!");
          } catch (err) {
            alert("Verification failed: " + (err.message || "Contact support"));
          }
        },

        theme: { color: "#89A8B2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) =>
        alert("Payment failed: " + r.error.description),
      );
      rzp.open();
    } catch (err) {
      console.error("Razorpay openCheckout error", err);
      alert("Something went wrong: " + (err.message || "Please try again"));
    }
  };

  return { openCheckout };
};