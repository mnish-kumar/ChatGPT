import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/store/reducers/userSlice";
import { checkAuth } from "@/store/userAction";

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

    dispatch(setAccessToken(token));

    dispatch(checkAuth()).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#1e2130] border-t-[#ff3e7f] animate-spin" />
    </div>
  );
};

export default OAuthSuccess;