import { LogOut } from "lucide-react";
import { useAuth } from "../auth/hooks/useauth";


const Logout = () => {
    const { handleLogout } = useAuth();

    const Logout = async () => {
      await handleLogout();
    }

  return (
    <div>
      <button 
        className="sidebar-footer-btn"
        onClick={Logout}
      >
        <LogOut size={18} />

        <span>Logout</span>
      </button>
    </div>
  );
};

export default Logout;

