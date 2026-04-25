import { Check, X } from "lucide-react";

const FEATURES = [
  { label: "Resume Analysis", free: "Limited", pro: "Unlimited" },
  { label: "AI Suggestions", free: "Basic", pro: "Advanced" },
  { label: "Job Match %", free: false, pro: true },
  { label: "Priority Processing", free: false, pro: true },
];

const ValueCell = ({ value }) => {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
        <Check size={16} className="text-gray-900 cursor-pointer" />
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-400">
        <X size={16} className="text-gray-400 cursor-pointer" />
      </span>
    );
  }

  return <span className="text-sm font-medium text-gray-700">{value}</span>;
};

const FeatureRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <ValueCell value={value} />
    </div>
  );
};

const PlanCard = ({
  title,
  price,
  per,
  subtitle,
  cta,
  ctaDisabled,
  priceLine,
  features,
}) => {
  return (
    <section className="w-full rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-semibold text-gray-900">{price}</span>
            <span className="pb-1 text-xs font-medium text-gray-500">{per}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      <button
        type="button"
        disabled={ctaDisabled}
        className={
          "mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ease-out " +
          (ctaDisabled
            ? "cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400"
            : "cursor-pointer bg-gray-900 text-white hover:bg-black")
        }
      >
        {cta}
      </button>

      <div className="mt-6 space-y-1 border-t border-gray-100 pt-5">
        {features.map((f) => (
          <FeatureRow key={f.label} label={f.label} value={f.value} />
        ))}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm text-gray-600">Price</span>
          <span className="text-sm font-semibold text-gray-900">{priceLine ?? price}</span>
        </div>
      </div>
    </section>
  );
};

const UserPlan = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const freeFeatures = FEATURES.map((f) => ({ label: f.label, value: f.free }));
  const proFeatures = FEATURES.map((f) => ({ label: f.label, value: f.pro }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer rounded-md p-2 text-gray-400 transition-all duration-200 ease-out hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-center text-xl font-semibold text-gray-900">
          Upgrade your plan
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          <PlanCard
            title="Free"
            price="₹0"
            per="/ month"
            subtitle="Keep chatting with expanded access"
            cta="Your current plan"
            ctaDisabled
            priceLine="₹0"
            features={freeFeatures}
          />
          <PlanCard
            title="Pro"
            price="₹399"
            per="/ month"
            subtitle="Unlock the full experience"
            cta="Upgrade to Pro"
            priceLine="₹399/month"
            features={proFeatures}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPlan;