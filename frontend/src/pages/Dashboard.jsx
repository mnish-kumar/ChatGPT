import PixelCard from "@/components/PixelCard";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextType from "@/components/TextType";
import { MenuIcon } from "lucide-react/dist/cjs/lucide-react";
import { useEffect, useRef, useState } from "react";
import Dropdown from "./user/Dropdown";
import { setAccessToken } from "@/store/reducers/userSlice"; 
import { checkAuth } from "@/store/userAction";     

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((s) => s.user);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
     
      dispatch(setAccessToken(token));
      window.history.replaceState({}, "", "/dashboard");
      dispatch(checkAuth());
    } else {
  
      dispatch(checkAuth());
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-chart-1 text-foreground font-sans gap-10 justify-center items-center">
      <div ref={menuRef} className="absolute top-6 left-6">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-card transition hover:bg-muted"
        >
          <MenuIcon size={18} />
        </button>
        {menuOpen && <Dropdown onClose={() => setMenuOpen(false)} />}
      </div>

      <PixelCard variant="pink" className="cursor-pointer" onClick={() => navigate("/chat")}>
        <h1 className="absolute font-heading text-5xl font-semibold text-center">ChitChat</h1>
      </PixelCard>

      <PixelCard
        variant="yellow"
        className="cursor-pointer"
        onClick={() => navigate("/resume-analyzer")}
      >
        <h1 className="absolute font-heading text-3xl font-medium text-center">
          <TextType
            text={["Get Hired Faster", "AI Resume Intelligence", "Crack Your Dream Job"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
          />
        </h1>
        <div className="absolute bottom-8 flex flex-col">
          {user?.plan?.type !== "PREMIUM" ? (
            <>
              <span className="mb-1 text-sm text-center leading-relaxed">
                Upgrade to Premium for unlimited access
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/subscription");
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#89A8B2] hover:bg-[#3a9ec0]
                  text-[#0f1219] font-semibold text-sm transition-all cursor-pointer"
              >
                ⚡ Upgrade to Premium
              </button>
            </>
          ) : (
            <span className="mb-1 text-lg font-medium text-center leading-relaxed">
              Now we help you faster to get hired 🚀
            </span>
          )}
        </div>
      </PixelCard>
    </div>
  );
};

export default Dashboard;