import { useDispatch } from "react-redux";
import { setPremium } from "@/store/reducers/userSlice";
import { createOrder } from "@/api/order.api";
import { initializePayment, verifyPayment } from "@/api/paymnet.api";

export const useRazorpay = () => {
  const dispatch = useDispatch();

  const openCheckout = async () => {
    try {
      // Step 1 — Order create
      const orderData = await createOrder();
      const { razorpayOrderId, orderId, amount, currency } = orderData;

      // Step 2 — Payment initialize
      await initializePayment(orderId);

      // Step 3 — Checkout open
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "JarviSync",
        description: "Premium Plan - 30 Days",
        order_id: razorpayOrderId,

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
            },
            sequence: ["block.upi", "netbanking", "card", "emi", "wallet"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        handler: async (response) => {
          try {
            // Step 4 — Verify
            await verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            dispatch(setPremium());
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
      alert("Something went wrong: " + (err.message || "Please try again"));
    }
  };

  return { openCheckout };
};
