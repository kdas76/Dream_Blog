import React, { useState } from "react";
import axios from "../utils/axiosInstance"; // ✅ Use the configured axios instance

export default function UploadModal({ isOpen, onClose, onUploadFinished }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setDesc("");
    setUploading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !desc)
      return alert("Please provide an image, title, and description!");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", desc);

    try {
      await axios.post("/posts", formData); // ✅ Use relative path, base URL is in the instance
      onUploadFinished();
      handleClose();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Create New Post</h2>

        {!preview ? (
          <label className="upload-area-modal">
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            <p>📤 Drag & Drop or <span>Choose File</span></p>
          </label>
        ) : (
          <div className="upload-preview-modal">
            <img src={preview} alt="Preview" />
            <input type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Enter Description" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
        )}

        <div className="modal-actions">
          <button onClick={handleUpload} disabled={uploading} className="save-btn"> {uploading ? "Uploading..." : "Upload Post"} </button>
          <button onClick={handleClose} className="cancel-btn"> Cancel </button>
        </div>
      </div>
    </div>
  );
}