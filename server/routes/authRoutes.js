const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /auth/signup
router.post("/signup", authController.signup);

// POST /auth/login
router.post("/login", authController.login);

// POST /auth/verify-otp - This is the new route for OTP verification
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;