import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "@/components/PublicRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ChatPageSkeleton,
  DashboardSkeleton,
  GenericPageLoader,
  HeroSkeleton,
  LoginSkeleton,
  NavbarSkeleton,
  RegisterSkeleton,
  ReportHistorySkeleton,
  ResumeHomeSkeleton,
  TwoFactorSettingSkeleton,
  UserProfileSkeleton,
} from "@/components/skeletons";

// Lazy load components for better performance
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const PremiumRoute = lazy(() => import("@/components/PremiumRoute"));
const Subscription = lazy(() => import("@/components/Subscription"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ForgetPassword = lazy(
  () => import("@/pages/user/forgetPassword/ForgetPassword"),
);
const ResetPassword = lazy(
  () => import("@/pages/user/forgetPassword/ResetPassword"),
);
const UserProfile = lazy(() => import("@/pages/user/userProfile"));
const TwoFactorSettings = lazy(
  () => import("@/pages/user/2FA/TwoFactorSettings"),
);
const ChangePassword = lazy(
  () => import("@/pages/user/changePassword/ChangePassword"),
);
const ChatHome = lazy(() => import("@/pages/chat/ChatHome"));
const ResumeHome = lazy(() => import("@/pages/resume/ResumeHome"));
const Dropdown = lazy(() => import("@/pages/user/Dropdown"));
const ReportHistory = lazy(() => import("@/pages/resume/ReportHistory"));

const HomeSkeleton = () => (
  <div className="min-h-screen bg-[#F1F0E8] font-sans text-slate-900 antialiased">
    <div className="pt-16">
      <NavbarSkeleton />
    </div>
    <main className="relative">
      <HeroSkeleton />
    </main>
  </div>
);

const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/profile"
            element={
              <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfile />
              </Suspense>
            }
          />

          <Route
            path="/settings/2fa"
            element={
              <Suspense fallback={<TwoFactorSettingSkeleton />}>
                <TwoFactorSettings />
              </Suspense>
            }
          />

          <Route
            path="/change-password"
            element={
              <Suspense fallback={<GenericPageLoader />}>
                <ChangePassword />
              </Suspense>
            }
          />

          <Route
            path="/chat"
            element={
              <Suspense fallback={<ChatPageSkeleton />}>
                <ChatHome />
              </Suspense>
            }
          />

          <Route
            path="/subscription"
            element={
              <Suspense fallback={<GenericPageLoader />}>
                <Subscription />
              </Suspense>
            }
          />

          <Route element={<PremiumRoute />}>
            <Route
              path="/resume-analyzer"
              element={
                <Suspense fallback={<ResumeHomeSkeleton />}>
                  <ResumeHome />
                </Suspense>
              }
            />

            <Route
              path="/report-history"
              element={
                <Suspense fallback={<ReportHistorySkeleton />}>
                  <ReportHistory />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <Home />
              </Suspense>
            }
          />

          <Route
            path="/login"
            element={
              <Suspense fallback={<LoginSkeleton />}>
                <Login />
              </Suspense>
            }
          />

          <Route
            path="/register"
            element={
              <Suspense fallback={<RegisterSkeleton />}>
                <Register />
              </Suspense>
            }
          />

          <Route
            path="/forget-password"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center">
                    <p>Loading...</p>
                  </div>
                }
              >
                <ForgetPassword />
              </Suspense>
            }
          />

          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<GenericPageLoader />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/dropdown"
            element={
              <Suspense fallback={<GenericPageLoader />}>
                <Dropdown />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default MainRoute;
