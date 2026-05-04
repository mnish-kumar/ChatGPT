import { useRazorpay } from "@/hooks/useRazorpay";

export default function PremiumButton() {
  const { openCheckout } = useRazorpay();

  return (
    <button
      onClick={openCheckout}
      className="w-full px-4 py-2.5 rounded-xl bg-[#89A8B2] hover:bg-[#3a9ec0]
        text-[#0f1219] font-semibold text-sm transition-all cursor-pointer"
    >
      ⚡ Upgrade to Premium
    </button>
  );
}