import {
  CircleUser,
  LogOut,
  LayoutDashboard,
  FileUser,
  MessageCircle,
} from "lucide-react/dist/cjs/lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/userAction";
import { useSelector } from "react-redux";

const Dropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    onClose();
  };

  return (
    <div
      className="absolute top-10 left-4 z-50 w-58 overflow-hidden rounded-xl bg-[#0d0f14] border border-[#1e2130] text-gray-400 shadow-lg"
      style={{ animation: "slideDown 0.2s ease" }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* User info */}
      <div className="border-b border-[#1e2130] px-4 py-3">
        <p className="text-sm font-medium ">
          {user?.fullname?.firstname} {user?.fullname?.lastname}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
      </div>

      {/* Upgrade */}
      <div className="px-2.5 pt-2 pb-1">
        <button
          onClick={() => handleNav("/pricing")}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition"
          style={{ background: "#EEEDFE", color: "#3C3489" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#534AB7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {user?.plan.type ? `${user.plan.type} ` : ""}
        </button>
      </div>

      <div className="my-1 h-px bg-border" />

      {/* Nav items */}
      <button
        onClick={() => handleNav("/dashboard")}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition hover:border rounded hover:border-[#ff3e7f]/40 hover:bg-[#1e2130]"
      >
        <LayoutDashboard size={15} /> Dashboard
      </button>

      <button
        onClick={() => handleNav("/resume-analyzer")}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition  hover:border rounded hover:border-[#ff3e7f]/40 hover:bg-[#1e2130]"
      >
        <FileUser size={15} /> Insights
      </button>

      <button
        onClick={() => handleNav("/chat")}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition  hover:border rounded hover:border-[#ff3e7f]/40 hover:bg-[#1e2130]"
      >
        <MessageCircle size={15} /> ChitChat
      </button>

      <button
        onClick={() => handleNav("/profile")}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition  hover:border rounded hover:border-[#ff3e7f]/40 hover:bg-[#1e2130]"
      >
        <CircleUser size={15} /> Profile
      </button>

      <div className="my-1 h-px bg-border" />

      <button
        onClick={handleLogout}
        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition hover:bg-destructive/10"
      >
        <LogOut size={15} /> Logout
      </button>
    </div>
  );
};

export default Dropdown;
