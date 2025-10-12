// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");

// const app = express();
// const port = 5000;

// // --- Middleware ---
// app.use(cors()); // Allow requests from your frontend
// app.use(express.json()); // To parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
// const authRoutes = require('./routes/auth');
// app.use('/api', authRoutes);

// // mount posts routes below (ensure you import and protect as needed)
// const postsRoutes = require('./routes/posts');
// app.use('/api/posts', postsRoutes);

// // static uploads (if not already)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const auth = require('./middleware/authMiddleware');
// // example
// router.post('/', auth, upload.single('image'), createPostHandler);
// router.put('/:id', auth, updatePostHandler);
// router.delete('/:id', auth, deletePostHandler);


// // --- Static File Serving ---
// // This is crucial. It makes the 'uploads' folder public so images can be accessed by URL.
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // --- Multer Configuration for File Uploads ---
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // The folder where uploaded files will be stored
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     // Create a unique filename to avoid conflicts
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// // --- API Routes ---

// // 👇 ADD THIS: Import and use the posts router
// const postRoutes = require("./routes/posts");
// app.use("/posts", postRoutes);

// // Add a root route handler for welcoming message
// app.get("/", (req, res) => {
//   res.send("Welcome to the DreamBlogger API!");
// });

// // --- Start Server ---
// app.listen(port, () => {
//   console.log(`✅ Server is running on http://localhost:${port}`);
// });
// // server/index.js (or app.js)
// // mount auth
// server/index.js
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
