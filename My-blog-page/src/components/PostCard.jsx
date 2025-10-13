import React from "react";

export default function PostCard({ photo, view, onEdit, onDelete, authorName, editable }) {
  return (
    <div className={`card ${view}`}>
      <div className="card-img-wrapper">
        <img src={photo.img} alt={photo.title} className="card-img" />
      </div>
      <div className="card-body">
        <h2 className="card-title">{photo.title}</h2>
        <p className="card-desc">{photo.desc}</p>
        <div className="card-footer">
          <div className="author-info">
            By: {authorName || "Unknown"}
          </div>
          {editable && (
            <div className="card-actions">
              <button onClick={() => onEdit(photo)} className="icon-btn edit-btn" title="Edit">
                ✏️
              </button>
              <button onClick={() => onDelete(photo.id)} className="icon-btn delete-btn" title="Delete">
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
