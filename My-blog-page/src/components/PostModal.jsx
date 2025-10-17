import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useTheme } from "../ThemeContext";

export default function PostModal({ mode = "create", post = null, isOpen, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();

  // Initialize values when editing
  useEffect(() => {
    if (mode === "edit" && post) {
      setTitle(post.title || "");
      setDesc(post.desc || "");
      setPreview(post.img || null);
    } else if (mode === "create") {
      resetForm();
    }
  }, [mode, post]);

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setDesc("");
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (mode === "create" && (!file || !title || !desc))
      return alert("Please provide an image, title, and description!");
    if (mode === "edit" && (!title || !desc))
      return alert("Title and description cannot be empty!");

    setLoading(true);
    try {
      if (mode === "create") {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("description", desc);
        await axios.post("/posts", formData);
      } else {
        await axios.put(`/posts/${post.id}`, { title, description: desc });
      }
      onSubmit?.();
      onClose();
      resetForm();
    } catch (err) {
      console.error(`${mode === "create" ? "Upload" : "Update"} failed:`, err);
      alert(`Failed to ${mode === "create" ? "upload" : "save"} post.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        resetForm();
        onClose();
      }}
    >
      <div
        className={`relative w-[90%] max-w-lg rounded-2xl p-6 shadow-2xl border animate-slideUp ${
          dark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-900 dark:text-slate-100 tracking-tight">
          {mode === "create" ? "Create New Post" : "Edit Post"}
        </h2>

        {/* <h2 className="text-2xl font-bold text-center mb-5 text-gray-900 dark:text-slate-100">
          {mode === "create" ? "Create New Post" : "Edit Post"}
        </h2> */}

        {/* Upload area */}
        {!preview && mode === "create" ? (
          <label className="from-control mb-4 flex flex-col items-center w-full justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl py-10 cursor-pointer hover:border-blue-500 transition">
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            <p className="text-gray-600 dark:text-slate-300 text-center">
              📤 Drag & Drop or <span className="text-blue-600 font-semibold">Choose File</span>
            </p>
          </label>
        ) : (
          <div className="mb-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-[250px] object-cover rounded-xl shadow mb-4"
              />
            )}
          </div>
        )}

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Enter Title"
          className="form-control mb-3 bg-gray-50 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:placeholder-slate-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows={4}
          placeholder="Enter Description"
          className="form-control mb-4 bg-gray-50 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:placeholder-slate-400"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="btn btn-outline-secondary dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`btn btn-${mode === "create" ? "primary" : "success"}`}
          >
            {loading
              ? mode === "create"
                ? "Uploading..."
                : "Saving..."
              : mode === "create"
              ? "Upload Post"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
