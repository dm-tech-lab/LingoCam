import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProtectedRoute } from "../utils/ProtectedRoutes";

const EmailVerified = () => {
  useProtectedRoute();

  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) navigate("/login");
  }, [countdown, navigate]);

  return (
    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Вашият акаунт е верифициран
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Обратно на главната страница
          </Link>
          <Link to="/contact" className="text-sm font-semibold text-gray-900">
            Свържете се с нас <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <p className="mt-6 text-gray-600 text-sm">
          Автоматично пренасочване след: {countdown} секунди
        </p>
      </div>
    </div>
  );
};

export default EmailVerified;
