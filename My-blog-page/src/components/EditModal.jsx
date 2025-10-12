import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // ✅ Use the configured axios instance

export default function EditModal({ post, onClose, onUpdate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.desc);
    }
  }, [post]);

  if (!post) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/posts/${post.id}`, { // ✅ Use relative path, base URL is in the instance
        title,
        description,
      });
      onUpdate(); // This will trigger a re-fetch in App.jsx
      onClose();
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit Post</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Post Description"
          rows={4}
        />
        <div className="modal-actions">
          <button onClick={handleSave} disabled={isSaving} className="save-btn">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onClose} className="cancel-btn"> Cancel </button>
        </div>
      </div>
    </div>
  );
}