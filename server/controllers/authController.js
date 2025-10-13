// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { createUser, getUserByEmail } = require("../models/userModel");

// const JWT_SECRET = process.env.JWT_SECRET;
// const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ error: "All fields required" });

//     const existing = await getUserByEmail(email);
//     if (existing) return res.status(409).json({ error: "Email already used" });

//     const hashed = await bcrypt.hash(password, SALT_ROUNDS);
//     const user = await createUser({ name, email, hashedPassword: hashed });

//     res.status(201).json({ message: "User created", user });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ error: "Email & password required" });

//     const user = await getUserByEmail(email);
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, email: user.email, name: user.name },
//       JWT_SECRET,
//       { expiresIn: JWT_EXPIRES_IN }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// server/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ===============================
// 🔹 SIGNUP
// ===============================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required." });

    const existing = await getUserByEmail(email);
    if (existing)
      return res.status(409).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({ name, email, hashedPassword: hashed });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ===============================
// 🔹 LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required." });

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
