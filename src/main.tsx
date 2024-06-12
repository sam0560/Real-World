import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SingleArticle from "./views/SingleArticle.tsx";

// Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />}></Route>
      <Route path="article/:slug" element={<SingleArticle />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NavBar />
    <RouterProvider router={router} />
    <Footer />
  </React.StrictMode>
);
