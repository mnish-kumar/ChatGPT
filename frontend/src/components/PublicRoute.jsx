import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);


  if (isLoading) {
    return null; 
  }

  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → public page
  return <Outlet />;
};

export default PublicRoute;