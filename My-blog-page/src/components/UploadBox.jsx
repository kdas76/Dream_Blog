// src/components/UploadBox.jsx
import React, { useState } from "react";
import axios from "axios";

export default function UploadBox({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !desc)
      return alert("Please select image, title, and description!");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("description", desc);

      const res = await axios.post("http://localhost:5000/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Upload success:", res.data);
      alert("Upload successful!");

      // reset
      onUpload?.();
      setFile(null);
      setPreview(null);
      setTitle("");
      setDesc("");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card upload-box">
      {!file ? (
        <label className="upload-area">
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          <p>📤 Drag & Drop or <span>Choose File</span></p>
        </label>
      ) : (
        <div className="upload-preview">
          <img src={preview} alt="Preview" />
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
