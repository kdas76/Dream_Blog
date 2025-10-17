// Email verifier code

require("dotenv").config(); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {
  createUser,
  getUserByEmail,
  getUserByVerificationToken,
  verifyUserEmail,
  updateUserOTP,
} = require("../models/userModel");
const validator = require("validator");
const disposableDomains = require("disposable-email-domains");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ===============================
// 🔹 SIGNUP (with Email Verification)
// ===============================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required." });

    const domain = email.split("@")[1]?.toLowerCase();

// 1. Syntax check
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

// 2. Disposable / temp mail check
    if (disposableDomains.includes(domain)) {
      return res.status(400).json({ error: "Disposable or temporary emails are not allowed." });
    }

// 3. Minimal domain sanity (only reject if completely malformed)
    if (!domain || domain.length < 3 || !domain.includes(".")) {
      return res.status(400).json({ error: "Invalid email domain." });
  }


    const existing = await getUserByEmail(email);
    if (existing)
      return res.status(409).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    const user = await createUser({
      name,
      email,
      hashedPassword: hashed,
      verificationToken: otp, // Using the same field for OTP
      otpExpires,
    });

    const html = `
      <h2>Welcome to Dream Blog, Hi ${name}</h2>
      <p>Your One-Time Password (OTP) for account verification is:</p>
      <h1 style="font-size: 36px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn’t sign up, ignore this email.</p>
    `;
    await sendEmail(email, "Verify your email address", html);

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


// ===============================
// 🔹 EMAIL VERIFY
// ===============================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    if (user.verified) {
      return res.status(400).json({ error: "Account already verified." });
    }

    if (user.verification_token !== otp || new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Verification successful, log the user in
    await verifyUserEmail(otp);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Account verified and logged in successfully!",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("OTP Verify error:", err.message);
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

    if (!user.verified)
      return res.status(401).json({ error: "Please verify your email first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
