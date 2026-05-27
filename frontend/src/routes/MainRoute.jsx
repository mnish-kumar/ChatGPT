import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
import PublicRoute from "@/components/PublicRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
const PremiumRoute = lazy(() => import("@/components/PremiumRoute"));
const Subscription = lazy(() => import("@/components/Subscription"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ForgetPassword = lazy(() => import("@/pages/user/forgetPassword/ForgetPassword"));
const ResetPassword = lazy(() => import("@/pages/user/forgetPassword/ResetPassword"));
const UserProfile = lazy(() => import("@/pages/user/userProfile"));
const TwoFactorSettings = lazy(() => import("@/pages/user/2FA/TwoFactorSettings"));
const ChangePassword = lazy(() => import("@/pages/user/changePassword/ChangePassword"));
const ChatHome = lazy(() => import("@/pages/chat/ChatHome"));
const ResumeHome = lazy(() => import("@/pages/resume/ResumeHome"));
const Dropdown = lazy(() => import("@/pages/user/Dropdown"));
const ReportHistory = lazy(() => import("@/pages/resume/ReportHistory"));

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

          <Route path="/subscription" element={<Subscription />} />

          <Route element={<PremiumRoute />}>
            <Route path="/resume-analyzer" element={<ResumeHome />} />
            <Route path="/report-history" element={<ReportHistory />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
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
