import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function PostCard({ photo, view, onEdit, onDelete, authorName, user }) {
  const DESCRIPTION_LIMIT = 100;
  const { dark } = useTheme();

  const truncatedDesc =
    photo.desc && photo.desc.length > DESCRIPTION_LIMIT
      ? `${photo.desc.substring(0, DESCRIPTION_LIMIT)}...`
      : photo.desc;

  // Card view specific classes
  const viewClasses = {
    grid: "flex-col h-full",
    list: "flex-col md:flex-row md:h-48", // Set a fixed height for list view on medium screens and up
  };

  const imageContainerClasses = {
    grid: "h-50", // Reduced height for better balance
    list: "h-48 md:h-full md:w-72 md:flex-shrink-0", // Set initial height for mobile, and full height for md screens
  };

  return (
    <div
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg ${dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} ${viewClasses[view]}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${imageContainerClasses[view]}`}>
        <img
          src={photo.img}
          alt={photo.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-grow flex-col p-4">
        <h5 className="mb-2 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {photo.title}
        </h5>

        <div className="flex-grow">
          <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {truncatedDesc}
            <Link
              to={`/post/${photo.id}`}
              className="ml-1 inline-block text-sm font-semibold text-blue-600 no-underline hover:underline dark:text-blue-400"
            >
              Read More
            </Link>
          </p>
        </div>

        {/* Author + Actions */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <small className="text-xs text-slate-500 dark:text-slate-400">
              By{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {authorName || "Unknown"}
              </span>
            </small>
          </div>

          {user && (photo.user_id === user.id || user.role === "admin") && (
            <div className="flex items-center gap-4">
              {user.id === photo.user_id && (
                <button
                  onClick={() => onEdit(photo)}
                  className="text-slate-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  title="Edit"
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
              )}
              <button
                onClick={() => onDelete(photo.id)}
                className="text-slate-500 transition-colors hover:text-red-600 dark:hover:text-red-500"
                title="Delete"
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
