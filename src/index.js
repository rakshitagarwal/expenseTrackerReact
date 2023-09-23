import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/authContextProvider";
import { CustomBrowserRouter } from "../src/components/customBrowserRouter";
import store from "./store/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <CustomBrowserRouter>
      <App />
    </CustomBrowserRouter>
  </Provider>
);
