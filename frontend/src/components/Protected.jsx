import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useauth";

const Protected = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen bg-(--primary-color)">
            <p className="text-(--text-color) text-xl font-medium">Loading...</p>
          </div>
        );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
}

export default Protected