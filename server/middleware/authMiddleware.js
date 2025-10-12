// // server/middleware/authMiddleware.js
// // Verifies JWT and attaches user info to req.user

// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers['authorization'] || req.headers['Authorization'];
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Authorization header missing or malformed' });
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Token missing' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     // Attach minimal user info to request
//     req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
//     return next();
//   } catch (err) {
//     console.error('JWT verify error:', err);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// }

// module.exports = authMiddleware;

// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;

