import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../components/Profile";
import ErrorPage from "../pages/ErrorPage";
import Protected from "../components/Protected";

const MianRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default MianRoutes;
