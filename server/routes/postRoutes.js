// server/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middlewares & Controllers
const auth = require("../middleware/authMiddleware");
const postCtrl = require("../controllers/postController");

// === Multer setup for image uploads ===
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });

// === POST ROUTES ===

// GET all posts (supports ?page, ?limit, ?query, ?user_id)
router.get("/", postCtrl.getAll);

// Public: Get single post by ID
router.get("/:id", postCtrl.getById);


// CREATE new post (requires login)
router.post("/", auth, upload.single("image"), postCtrl.create);

// UPDATE post (only owner)
router.put("/:id", auth, upload.single("image"), postCtrl.update);

// DELETE post (only owner)
router.delete("/:id", auth, postCtrl.remove);

module.exports = router;
