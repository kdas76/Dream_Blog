import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import "./Auth.css"; // ✅ reuse same style file

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    async function verify() {
      try {
        const res = await axios.get(`/auth/verify/${token}`);
        setStatus("success");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setStatus("error");
        setTimeout(() => navigate("/signup"), 2500);
      }
    }
    verify();
  }, [token, navigate]);

  return (
    <div className="auth-container verify-container">
      {status === "verifying" && (
        <>
          <div className="verify-loader"></div>
          <h2>Verifying your email...</h2>
          <p>Please wait a few seconds while we confirm your account.</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="verify-icon success">✔</div>
          <h2>Email Verified Successfully!</h2>
          <p>Redirecting to login page...</p>
        </>
      )}
      {status === "error" && (
        <>
          <div className="verify-icon error">✖</div>
          <h2>Invalid or Expired Link</h2>
          <p>Redirecting to signup page...</p>
        </>
      )}
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../utils/axiosInstance";
// import "./Auth.css";

// export default function VerifyEmail() {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("verifying"); // verifying | success | error

//   useEffect(() => {
//     async function verify() {
//       try {
//         await axios.get(`/auth/verify/${token}`);
//         setStatus("success");
//         setTimeout(() => navigate("/login"), 2000);
//       } catch (err) {
//         setStatus("error");
//         setTimeout(() => navigate("/signup"), 2500);
//       }
//     }
//     verify();
//   }, [token, navigate]);

//   return (
//     <div className="auth-container verify-container">
//       {status === "verifying" && (
//         <>
//           <div className="verify-loader"></div>
//           <h2>Verifying your email...</h2>
//           <p>Please wait a few seconds.</p>
//         </>
//       )}
//       {status === "success" && (
//         <>
//           <div className="verify-icon success">✔</div>
//           <h2>Email Verified Successfully!</h2>
//           <p>Redirecting to login page...</p>
//         </>
//       )}
//       {status === "error" && (
//         <>
//           <div className="verify-icon error">✖</div>
//           <h2>Invalid or Expired Link</h2>
//           <p>Redirecting to signup page...</p>
//         </>
//       )}
//     </div>
//   );
// }
