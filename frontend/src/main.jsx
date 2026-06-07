import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store.jsx";
import { Provider } from "react-redux";
import { setApiStore } from "./api/storeBridge.js";
import { Toaster } from "react-hot-toast";

setApiStore(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </BrowserRouter>
  </Provider>,
);
