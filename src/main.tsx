import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import SingleArticle from "./views/SingleArticle.tsx";
import Home from "./views/Home.tsx";
import Login from "./views/Auth/Login.tsx";
import Register from "./views/Auth/Register.tsx";
import Profile from "./views/Profile.tsx";
import HandleUndefinedRoutes from "./HandleUndefinedRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/article/:slug" element={<SingleArticle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/:username" element={<Profile />} />

            {/* Undefined routes */}
            <Route path="*" element={<HandleUndefinedRoutes />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);
