import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "@/store/reducers/userSlice";
import api from "@/api/axios";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const handleAuth = async () => {
      try {
        const res = await api.get("/api/auth/get-me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data;

        if (user) {
          dispatch(setAccessToken(token));
          dispatch(setUser(user));
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("OAuth error:", err);
        navigate("/login", { replace: true });
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#1e2130] border-t-[#ff3e7f] animate-spin" />
    </div>
  );
};

export default OAuthSuccess;