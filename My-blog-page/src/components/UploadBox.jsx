import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
      return alert("Please select an image, title, and description.");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("description", desc);

      await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Upload successful!");
      onUpload?.();

      // Reset
      setFile(null);
      setPreview(null);
      setTitle("");
      setDesc("");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Please check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=" bg-black-500 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 w-full max-w-lg mx-auto transition-all duration-300">
      {!file ? (
        // Upload area
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl py-12 px-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all">
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          <i className="bi bi-cloud-arrow-up text-4xl text-blue-600 mb-3"></i>
          <p className="text-gray-700 dark:text-slate-300 text-center">
            <strong>Drag & Drop</strong> or <span className="text-blue-600 font-semibold">Choose File</span>
          </p>
        </label>
      ) : (
        // Preview + form
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-[250px] object-cover rounded-lg shadow-md mb-5"
          />

          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control mb-3 bg-gray-50 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:ring-blue-500"
          />

          <textarea
            placeholder="Enter Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className="form-control mb-4 bg-gray-50 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:ring-blue-500"
          />

          <div className="flex justify-end w-full gap-3">
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setTitle("");
                setDesc("");
              }}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-1"></i> Upload
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
