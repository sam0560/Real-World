import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import SingleArticle from "./views/SingleArticle.tsx";
import Home from "./views/Home.tsx";
import Login from "./views/Auth/Login.tsx";
import Register from "./views/Auth/Register.tsx";
import Profile from "./views/Profile.tsx";

const HandleUndefinedRoutes = () => {
  const navigate = useNavigate();

  // Redirect to Home page for undefined routes
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="article/:slug" element={<SingleArticle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="*" element={<HandleUndefinedRoutes />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
