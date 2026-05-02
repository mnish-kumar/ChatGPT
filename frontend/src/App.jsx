import { useEffect } from "react";
import MainRoute from "./routes/MainRoute";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/userAction";

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      <MainRoute />
    </div>
  );
};

export default App;
