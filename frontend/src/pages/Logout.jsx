import axios from "axios";
import { LogOut } from "lucide-react";

const Logout = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

    const handleLogout = () => {
        // Clear user session or token here
        axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
        .then( ()=> {
            console.log("Logout successful");
            // Redirect to login page or home page
            window.location.href = "/login";
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
    }

  return (
    <div>
      <button 
        className="sidebar-footer-btn"
        onClick={handleLogout}
      >
        <LogOut size={18} />

        <span>Logout</span>
      </button>
    </div>
  );
};

export default Logout;

