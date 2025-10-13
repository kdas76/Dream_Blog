require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Routes ===
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

app.use("/api", authRoutes);        // Signup / Login
app.use("/api/posts", postsRoutes); // CRUD for posts

// === Static Folder for Image Access ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Root Route ===
app.get("/", (req, res) => {
  res.send("✅ Dream Blogger API is running successfully!");
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
