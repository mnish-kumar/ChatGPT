import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Already logged in hai → dashboard pe redirect karo
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → public page show karo
  return <Outlet />;
};

export default PublicRoute;