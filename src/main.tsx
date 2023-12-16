import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContextProvider from "./context/ContextProvider";
import { PersistGate } from "redux-persist/integration/react";
import "swiper/css/bundle";

const LoadingSpinner = () => (
  <div>Loading...</div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <PersistGate loading={<LoadingSpinner/>} persistor={persistor}>
        <ContextProvider>
          <ToastContainer />
          <App />
        </ContextProvider>
    </PersistGate>
  </Provider>
);
