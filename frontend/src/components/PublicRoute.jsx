import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  // Already logged in hai → dashboard pe redirect karo
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → public page show karo
  return <Outlet />;
};

export default PublicRoute;