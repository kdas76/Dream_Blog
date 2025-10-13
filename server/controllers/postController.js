const path = require("path");
const fs = require("fs");
const db = require("../config/db");
const {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getAllPosts,
} = require("../models/postModel");

exports.getAll = async (req, res) => {
  const { page = 1, limit = 9, query = "", user_id } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { posts, totalPosts } = await getAllPosts({ limit, offset, query });
    const filtered = user_id ? posts.filter(p => p.user_id == user_id) : posts;
    const totalPages = Math.ceil(totalPosts / limit);
    res.json({ posts: filtered, totalPages });
  } catch (err) {
    console.error("GET /posts error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};


// ===============================
// 🔹 PUBLIC: GET POST BY ID
// ===============================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // ✅ Wrap inside { post } to match frontend expectation
    res.json({ post });
  } catch (err) {
    console.error(`GET /posts/${req.params.id} error:`, err.message);
    res.status(500).json({ error: "Database error" });
  }
};





exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ error: "Title & description required" });

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
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
};



exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const existing = await getPostById(id);

    if (!existing) return res.status(404).json({ error: "Post not found" });
    if (existing.user_id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    if (req.file && existing.image_url) {
      const oldPath = path.join(__dirname, "..", existing.image_url);
      fs.unlink(oldPath, () => {});
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : existing.image_url;
    const updated = await updatePost({ id, title, description, image_url, user_id: req.user.id });

    res.json(updated);
  } catch (err) {
    console.error("PUT /posts/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) return res.status(404).json({ error: "Not found" });
    if (post.user_id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await deletePost(id, req.user.id);
    if (post.image_url) {
      const imgPath = path.join(__dirname, "..", post.image_url);
      fs.unlink(imgPath, () => {});
    }

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("DELETE /posts/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
