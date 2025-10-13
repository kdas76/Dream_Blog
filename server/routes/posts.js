// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");
// const db = require("../db"); // Import db
// const auth = require("../middleware/authMiddleware");
// const {
//   createPost,
//   updatePost,
//   deletePost,
//   getPostById,
//   getAllPosts,
// } = require("../models/postModel");

// // --- ensure uploads folder exists ---
// const uploadDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // --- multer setup ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
//     cb(null, unique);
//   },
// });
// const upload = multer({ storage });

// // ---------------------------
// // GET ALL POSTS (PUBLIC)
// // ---------------------------
// router.get("/", async (req, res) => {
//   const { page = 1, limit = 9, query = "" } = req.query;
//   const offset = (page - 1) * limit;

//   try {
//     // Use the improved model function to handle DB logic
//     const { posts, totalPosts } = await getAllPosts({ limit, offset, query });
//     const totalPages = Math.ceil(totalPosts / limit);

//     res.json({ posts, totalPages });
//   } catch (err) {
//     console.error("GET /posts error:", err.message);

//     //console.error("GET /posts error:", err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // ---------------------------
// // CREATE NEW POST (PROTECTED)
// // ---------------------------
// router.post("/", auth, upload.single("image"), async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const image_url = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!title || !description) {
//       return res.status(400).json({ error: "Title & description required" });
//     }

//     const newPost = await createPost({
//       title,
//       description,
//       image_url,
//       user_id: req.user.id, // logged-in user becomes owner
//     });

//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error("POST /posts error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------------------------
// // UPDATE POST (OWNER ONLY)
// // ---------------------------
// router.put("/:id", auth, upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     const existing = await getPostById(id);
//     if (!existing)
//       return res.status(404).json({ error: "Post not found" });

//     if (existing.user_id !== req.user.id) {
//       return res.status(403).json({ error: "Unauthorized to edit this post" });
//     }

//     // If a new image is uploaded, delete the old one.
//     if (req.file && existing.image_url) {
//       const oldImagePath = path.join(__dirname, "..", existing.image_url);
//       fs.unlink(oldImagePath, (err) => {
//         if (err) console.warn("Failed to delete old image:", oldImagePath);
//       });
//     }

//     const image_url = req.file ? `/uploads/${req.file.filename}` : existing.image_url;

//     const updated = await updatePost({
//       id,
//       title,
//       description,
//       image_url,
//       user_id: req.user.id,
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error("PUT /posts/:id error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------------------------
// // DELETE POST (OWNER ONLY)
// // ---------------------------
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const post = await getPostById(id);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     if (post.user_id !== req.user.id) {
//       return res.status(403).json({ error: "Unauthorized to delete this post" });
//     }

//     const deleted = await deletePost(id, req.user.id); // ✅ FIX: Pass user_id for authorization
//     if (!deleted) return res.status(403).json({ error: "Delete failed" });

//     // Delete image from disk if present
//     if (post.image_url) {
//       const imagePath = path.join(__dirname, "..", post.image_url);
//       fs.unlink(imagePath, (err) => {
//         if (err) console.warn("Failed to delete image:", imagePath);
//       });
//     }

//     res.json({ message: "Post deleted successfully" });
//   } catch (err) {
//     console.error("DELETE /posts/:id error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");
// const db = require("../db"); // Import db
// const auth = require("../middleware/authMiddleware");
// const {
//   createPost,
//   updatePost,
//   deletePost,
//   getPostById,
//   getAllPosts,
// } = require("../models/postModel");

// // --- ensure uploads folder exists ---
// const uploadDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // --- multer setup ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
//     cb(null, unique);
//   },
// });
// const upload = multer({ storage });

// // ---------------------------
// // ✅ GET ALL POSTS (supports ?user_id=... & ?query=...)
// // ---------------------------
// router.get("/", async (req, res) => {
//   const { page = 1, limit = 9, query = "", user_id } = req.query;
//   const offset = (page - 1) * limit;

//   try {
//     // Build dynamic WHERE clause
//     let baseQuery = `
//       SELECT p.*, u.name AS author_name
//       FROM posts p
//       JOIN users u ON p.user_id = u.id
//       WHERE 1=1
//     `;
//     const values = [];

//     if (query) {
//       baseQuery += ` AND (LOWER(p.title) LIKE $${values.length + 1} OR LOWER(p.description) LIKE $${values.length + 1})`;
//       values.push(`%${query.toLowerCase()}%`);
//     }

//     if (user_id) {
//       baseQuery += ` AND p.user_id = $${values.length + 1}`;
//       values.push(user_id);
//     }

//     // Count query (for pagination)
//     let countQuery = `SELECT COUNT(*) FROM posts WHERE 1=1`;
//     const countValues = [];

//     if (query) {
//       countQuery += ` AND (LOWER(title) LIKE $${countValues.length + 1} OR LOWER(description) LIKE $${countValues.length + 1})`;
//       countValues.push(`%${query.toLowerCase()}%`);
//     }

//     if (user_id) {
//       countQuery += ` AND user_id = $${countValues.length + 1}`;
//       countValues.push(user_id);
//     }

//     baseQuery += ` ORDER BY p.id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
//     values.push(limit, offset);

//     // Run queries
//     const [postResult, countResult] = await Promise.all([
//       db.query(baseQuery, values),
//       db.query(countQuery, countValues),
//     ]);

//     const totalPosts = parseInt(countResult.rows[0].count, 10);
//     const totalPages = Math.ceil(totalPosts / limit);

//     res.json({ posts: postResult.rows, totalPages });
//   } catch (err) {
//     console.error("GET /posts error:", err.message);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // ---------------------------
// // CREATE NEW POST (PROTECTED)
// // ---------------------------
// router.post("/", auth, upload.single("image"), async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const image_url = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!title || !description) {
//       return res.status(400).json({ error: "Title & description required" });
//     }

//     const newPost = await createPost({
//       title,
//       description,
//       image_url,
//       user_id: req.user.id,
//     });

//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error("POST /posts error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------------------------
// // UPDATE POST (OWNER ONLY)
// // ---------------------------
// router.put("/:id", auth, upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     const existing = await getPostById(id);
//     if (!existing) return res.status(404).json({ error: "Post not found" });

//     if (existing.user_id !== req.user.id) {
//       return res.status(403).json({ error: "Unauthorized to edit this post" });
//     }

//     if (req.file && existing.image_url) {
//       const oldImagePath = path.join(__dirname, "..", existing.image_url);
//       fs.unlink(oldImagePath, (err) => {
//         if (err) console.warn("Failed to delete old image:", oldImagePath);
//       });
//     }

//     const image_url = req.file ? `/uploads/${req.file.filename}` : existing.image_url;

//     const updated = await updatePost({
//       id,
//       title,
//       description,
//       image_url,
//       user_id: req.user.id,
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error("PUT /posts/:id error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------------------------
// // DELETE POST (OWNER ONLY)
// // ---------------------------
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const post = await getPostById(id);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     if (post.user_id !== req.user.id) {
//       return res.status(403).json({ error: "Unauthorized to delete this post" });
//     }

//     const deleted = await deletePost(id, req.user.id);
//     if (!deleted) return res.status(403).json({ error: "Delete failed" });

//     if (post.image_url) {
//       const imagePath = path.join(__dirname, "..", post.image_url);
//       fs.unlink(imagePath, (err) => {
//         if (err) console.warn("Failed to delete image:", imagePath);
//       });
//     }

//     res.json({ message: "Post deleted successfully" });
//   } catch (err) {
//     console.error("DELETE /posts/:id error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../db");
const auth = require("../middleware/authMiddleware");
const {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getAllPosts,
} = require("../models/postModel");

// --- ensure uploads folder exists ---
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// --- multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });


// ===============================
// 🔹 PUBLIC: GET ALL POSTS
// ===============================
router.get("/", async (req, res) => {
  const { page = 1, limit = 9, query = "", user_id } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Build dynamic WHERE clause
    let baseQuery = `
      SELECT p.*, u.name AS author_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (query) {
      baseQuery += ` AND (LOWER(p.title) LIKE $${values.length + 1} OR LOWER(p.description) LIKE $${values.length + 1})`;
      values.push(`%${query.toLowerCase()}%`);
    }

    if (user_id) {
      baseQuery += ` AND p.user_id = $${values.length + 1}`;
      values.push(user_id);
    }

    // Count query (for pagination)
    let countQuery = `SELECT COUNT(*) FROM posts p WHERE 1=1`;
    const countValues = [];

    if (query) {
      countQuery += ` AND (LOWER(p.title) LIKE $${countValues.length + 1} OR LOWER(p.description) LIKE $${countValues.length + 1})`;
      countValues.push(`%${query.toLowerCase()}%`);
    }

    if (user_id) {
      countQuery += ` AND p.user_id = $${countValues.length + 1}`;
      countValues.push(user_id);
    }

    baseQuery += ` ORDER BY p.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    // Run queries in parallel for efficiency
    const [postResult, countResult] = await Promise.all([
      db.query(baseQuery, values),
      db.query(countQuery, countValues),
    ]);

    const totalPosts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({ posts: postResult.rows, totalPages });
  } catch (err) {
    console.error("GET /posts error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});


// ===============================
// 🔹 CREATE POST (PROTECTED)
// ===============================
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description) {
      return res.status(400).json({ error: "Title & description required" });
    }

    const newPost = await createPost({
      title,
      description,
      image_url,
      user_id: req.user.id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("POST /posts error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ===============================
// 🔹 UPDATE POST (OWNER ONLY)
// ===============================
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const existing = await getPostById(id);

    if (!existing) return res.status(404).json({ error: "Post not found" });
    if (existing.user_id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    if (req.file && existing.image_url) {
      const oldImagePath = path.join(__dirname, "..", existing.image_url);
      fs.unlink(oldImagePath, () => {});
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : existing.image_url;
    const updated = await updatePost({ id, title, description, image_url, user_id: req.user.id });
    res.json(updated);
  } catch (err) {
    console.error("PUT /posts/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ===============================
// 🔹 DELETE POST (OWNER ONLY)
// ===============================
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user_id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const deleted = await deletePost(id, req.user.id);
    if (!deleted) return res.status(403).json({ error: "Delete failed" });

    if (post.image_url) {
      const imagePath = path.join(__dirname, "..", post.image_url);
      fs.unlink(imagePath, () => {});
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("DELETE /posts/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
