import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    async function verify() {
      try {
        await axios.get(`/auth/verify/${token}`);
        setStatus("success");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
        setTimeout(() => navigate("/signup"), 2500);
      }
    }
    verify();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700 text-center animate-fadeIn">
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-slate-100">
              Verifying Your Email
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Please wait a few seconds while we confirm your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl shadow-md animate-scaleUp">
                <i className="bi bi-check-lg"></i>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Redirecting to login page...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl shadow-md animate-shake">
                <i className="bi bi-x-lg"></i>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Invalid or expired link. Redirecting to signup page...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
