import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import MainLoader from "./components/shared/MainLoader.tsx";
import Register from "./screens/Register.tsx";
import Login from "./screens/Login.tsx";

// // add this to prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
    loader: () => <MainLoader />,
  },
  {
    path: "/login",
    element: <Login />,
    loader: () => <MainLoader />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  </React.StrictMode>
);
