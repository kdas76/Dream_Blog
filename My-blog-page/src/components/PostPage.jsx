import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "./PostPage.css";


export default function PostPage() {
  const { id } = useParams(); // ✅ get post ID from route
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axios.get(`/posts/${id}`);
        const p = res.data.post; // ✅ backend returns { post: {...} }
        console.log("📦 Response data:", res.data);


        // ✅ normalize data
        setPost({
          id: p.id,
          img: p.image_url
            ? `http://localhost:5000${p.image_url}`
            : "https://via.placeholder.com/800x400?text=No+Image",
          title: p.title || "Untitled Post",
          desc: p.description || "No description available.",
          author_name: p.author_name || "Unknown Author",
          created_at: p.created_at
            ? new Date(p.created_at).toLocaleDateString()
            : "Unknown Date",
        });
      } catch (err) {
        console.error("❌ Failed to fetch post:", err);
        setError("Failed to load post. It may have been deleted or moved.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="post-page-container d-flex justify-content-center align-items-center">
        <div className="loader"></div>
      </div>
    );
  }

  // === ERROR STATE ===
  if (error) {
    return (
      <div className="post-page-container text-center">
        <p className="text-danger mb-4">{error}</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          ← Back to All Posts
        </button>
      </div>
    );
  }

  // === NO POST FOUND ===
  if (!post) return null;

  // === MAIN POST CONTENT ===
  return (
    <div className="post-page-container">
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-secondary back-button"
      >
        ← Back to All Posts
      </button>

      <h1 className="post-page-title">{post.title}</h1>
      <p className="post-page-meta">
        By <strong>{post.author_name}</strong> on {post.created_at}
      </p>

      <img
        src={post.img}
        alt={post.title}
        className="post-page-image mb-3"
        loading="lazy"
      />

      <div className="post-page-content">
        <p>{post.desc}</p>
      </div>
    </div>
  );
}
