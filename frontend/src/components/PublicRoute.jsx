import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  // Already logged in hai → dashboard pe redirect karo
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // While auth state is resolving, still render public pages so they can show their own skeleton
  if (isLoading) {
    return <Outlet />;
  }

  // Not logged in → public page show
  return <Outlet />;
};

export default PublicRoute;