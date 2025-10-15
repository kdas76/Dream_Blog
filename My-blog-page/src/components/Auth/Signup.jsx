import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Signup({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [signupStep, setSignupStep] = useState("form"); // 'form' | 'otp'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // === SIGNUP STEP ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      setMessage(res.data.message || "Verification email sent! Check your inbox.");
      setSignupStep("otp");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === OTP STEP ===
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/verify-otp", { email, otp });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLoginSuccess?.(user);
      navigate("/");
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(err.response?.data?.error || "Invalid OTP or expired code.");
    } finally {
      setLoading(false);
    }
  };

  // === OTP VERIFICATION SCREEN ===
  if (signupStep === "otp") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700 mx-3">
          <h2 className="text-2xl font-bold text-center mb-3 text-blue-600 dark:text-blue-400">
            Verify Your Account
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-slate-400 mb-3">
            {message || "An OTP has been sent to your email."}
          </p>

          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="form-control text-center tracking-widest text-lg font-semibold bg-gray-50 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2 font-semibold rounded-lg mt-2"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Verifying...
                </>
              ) : (
                "Verify & Login"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-4">
            Didn’t get the code? Check spam or resend from your email.
          </p>
        </div>
      </div>
    );
  }

  // === SIGNUP FORM SCREEN ===
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-slate-700 mx-3">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2 font-semibold rounded-lg mt-2"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-5">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
