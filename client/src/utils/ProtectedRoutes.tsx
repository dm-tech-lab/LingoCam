import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  return null;
};
