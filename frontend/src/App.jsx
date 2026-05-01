import React, { useEffect } from "react";
import MainRoute from "./routes/MainRoute";
import { useDispatch } from "react-redux";
import { checkAuth } from "./store/userAction";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen bg-slate-400 p-1">
      <MainRoute />
    </div>
  );
};

export default App;
