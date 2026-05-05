import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PublicRoute from "@/components/PublicRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import ForgetPassword from "@/pages/user/forgetPassword/ForgetPassword";
import ResetPassword from "@/pages/user/forgetPassword/ResetPassword";
import UserProfile from "@/pages/user/UserProfile";
import TwoFactorSettings from "@/pages/user/2FA/TwoFactorSettings";
import ChangePassword from "@/pages/user/changePassword/ChangePassword";
import ChatHome from "@/pages/chat/ChatHome";
import ResumeHome from "@/pages/resume/ResumeHome";
import Dropdown from "@/pages/user/Dropdown";

const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings/2fa" element={<TwoFactorSettings />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/chat" element={<ChatHome />} />
          
        </Route>

        <Route element={<PublicRoute />}>
        <Route path="/resume-analyzer" element={<ResumeHome />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dropdown" element={<Dropdown />} />
        </Route>
      </Routes>
    </div>
  );
};

export default MainRoute;
