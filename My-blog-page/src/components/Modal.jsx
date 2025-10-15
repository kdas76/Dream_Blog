import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Modal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-2xl bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-slate-700 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={photo.src?.large || photo.img}
          alt={photo.alt || photo.title}
          className="rounded-xl w-full max-h-[60vh] object-cover mb-4 shadow-md"
        />

        {/* Title + Description */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          {photo.title || "Untitled Image"}
        </h2>
        {photo.desc && (
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 leading-relaxed">
            {photo.desc}
          </p>
        )}

        {/* Source Link */}
        {photo.url && (
          <a
            href={photo.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            View on Pexels →
          </a>
        )}

        {/* Close Button */}
        <div className="text-end mt-5">
          <button
            onClick={onClose}
            className="btn btn-outline-secondary inline-flex items-center gap-1"
          >
            <i className="bi bi-x-circle"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
}
