import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home';
import Profile from '../components/Profile';
import ErrorPage from '../pages/ErrorPage';
import { useAuth } from '../context/AuthContext';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const MianRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </div>
  )
}

export default MianRoutes