// import React, { useState } from "react";
// import axios from "../../utils/axiosInstance";
// import "./Auth.css";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     try {
//       const res = await axios.post("/auth/signup", { name, email, password });
//       alert("Verification email sent! Please check your inbox before logging in.");
//       navigate("/login");

//       setMessage("Account created successfully! You can now log in.");
//       setName("");
//       setEmail("");
//       setPassword("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Signup failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email Address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password (min 6 chars)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         {error && <p className="auth-error">{error}</p>}
//         {message && <p className="auth-success">{message}</p>}
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "./Auth.css";

export default function Signup({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [signupStep, setSignupStep] = useState("form"); // 'form' or 'otp'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // <-- ❗ এই লাইন-টা যোগ করতে হবে
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("/auth/signup", { name, email, password });

      // ✅ Show success feedback
      setMessage(res.data.message || "Verification email sent! Check your inbox.");
      setSignupStep("otp"); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/verify-otp", { email, otp });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (onLoginSuccess) onLoginSuccess(user);
      navigate("/"); // Redirect to home on successful verification and login
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
    }
  };

  if (signupStep === "otp") {
    return (
      <div className="auth-container">
        <h2>Verify Your Account</h2>
        <p className="auth-success">{message}</p>
        <p>An OTP has been sent to <strong>{email}</strong>. Please enter it below.</p>
        <form onSubmit={handleOtpSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="otp-input"
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit">Verify & Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
