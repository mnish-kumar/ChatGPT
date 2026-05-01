import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  // Auth check ho raha hai → loading show karo
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Authenticated nahi hai → login pe redirect karo
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated hai → page show karo
  return <Outlet />;
};

export default ProtectedRoute;