import { useEffect } from "react";
import MainRoute from "./routes/MainRoute";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/userAction";
import { useLocation } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const hash = location.hash;

    // Scroll to top for plain '/' and '/#top'
    if (!hash || hash === "#" || hash === "#top") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      return;
    }

    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    const element = document.getElementById(id);
    if (!element) return;

    // Allow a paint so layout is ready before scrolling.
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.pathname, location.hash]);

  return (
    <div className="w-full">
      <MainRoute />
    </div>
  );
};

export default App;
