import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PremiumRoute = () => {
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.user);

  if (isLoading) {
    return null;
  }

  const isPremium = (user?.plan?.type ?? "FREE") === "PREMIUM";

  if (!isPremium) {
    return (
      <Navigate
        to="/subscription"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default PremiumRoute;
