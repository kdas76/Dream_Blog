// import React, { useState } from "react";
// import axios from "../../utils/axiosInstance";
// import "./Auth.css";

// export default function Login({ onLoginSuccess }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await axios.post("/login", { email, password });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       if (onLoginSuccess) onLoginSuccess(user);
//     } catch (err) {
//       setError(err.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Sign In</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         {error && <p className="auth-error">{error}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import "./Auth.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //const res = await axios.post("/api/login", { email, password });
      const res = await axios.post("/login", { email, password });
      const { token, user } = res.data;

      // ✅ Validate response structure
      if (!user || !user.id) {
        console.error("⚠️ Invalid login response:", res.data);
        throw new Error("Login failed: invalid user data from server.");
      }

      // ✅ Save token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Notify parent (App.jsx)
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
