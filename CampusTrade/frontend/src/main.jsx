import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./Context/Storecontext.jsx";
import AuthContextProvider from "./Context/AuthContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthContextProvider>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);


