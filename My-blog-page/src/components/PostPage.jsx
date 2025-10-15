import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PostPage() {
  const { id } = useParams();
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
        const p = res.data.post;

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
      <div className="flex justify-center items-center h-screen">
        <div className="loader border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  // === ERROR STATE ===
  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center p-6">
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="btn btn-primary text-sm font-semibold"
        >
          ← Back to All Posts
        </button>
      </div>
    );
  }

  if (!post) return null;

  // === MAIN POST CONTENT ===
  return (
    <div className="max-w-3xl mx-auto my-10 px-6 py-8 dark:bg-slate-800 rounded-xl shadow-md">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-secondary mb-5 text-sm font-medium dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ← Back to All Posts
      </button>

      {/* Title */}
      <h1 className="mb-2 text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {post.title}
      </h1>

      {/* Meta Info */}
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        By <strong className="font-semibold text-slate-800 dark:text-slate-200">{post.author_name}</strong> on{" "}
        {post.created_at}
      </p>

      {/* Image */}
      <img
        src={post.img}
        alt={post.title}
        className="mb-8 w-full max-h-[450px] rounded-lg object-cover shadow-sm"
        loading="lazy"
      />

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert sm:prose-lg max-w-none">
        {post.desc.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
          <p key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
