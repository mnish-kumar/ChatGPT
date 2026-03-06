import { X, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PopUp = ({ isOpen, onClose, title, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <LogIn size={32} className="text-blue-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          {title || "Login Required"}
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-center mb-6">
          {message || "Please log in to continue using this feature."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => {
              onClose();
              navigate("/register");
            }}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default PopUp;