// import React from "react";
// import "./PostCard.css"; // Import the CSS file

// export default function PostCard({
//   photo,
//   view,
//   onEdit,
//   onDelete,
//   onViewPost, // This prop will handle the click on "Read More"
//   authorName,
//   editable,
// }) {
//   const isListView = view === "list";
//   const DESCRIPTION_LIMIT = 100;

//   return (
//     <div className={`card post-card ${isListView ? "list-view" : ""}`}>
//       <img src={photo.img} className="card-img-top" alt={photo.title} />
//       <div className="card-body">
//         <h5 className="card-title">{photo.title}</h5>
//         <div className="card-text-wrapper">
//           <p className="card-text">
//             {photo.desc && photo.desc.length > DESCRIPTION_LIMIT
//               ? `${photo.desc.substring(0, DESCRIPTION_LIMIT)}...`
//               : photo.desc}
//             <button onClick={() => onViewPost(photo.id)} className="btn btn-link p-0 read-more-btn">
//               Read More
//             </button>
//           </p>
//         </div>
//         <div className="d-flex justify-content-between align-items-center">
//           <div className="author-info">
//             <small className="text-muted">
//               By <span className="author-name">{authorName || "Unknown"}</span>
//             </small>
//           </div>
//           {editable && (
//             <div className="card-actions">
//               <button onClick={() => onEdit(photo)} className="icon-btn edit-btn" title="Edit">
//                 ✏️
//               </button>
//               <button onClick={() => onDelete(photo.id)} className="icon-btn delete-btn" title="Delete">
//                 🗑️
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";

export default function PostCard({
  photo,
  view,
  onEdit,
  onDelete,
  authorName,
  editable,
}) {
  const isListView = view === "list";
  const DESCRIPTION_LIMIT = 100;

  const truncatedDesc =
    photo.desc && photo.desc.length > DESCRIPTION_LIMIT
      ? `${photo.desc.substring(0, DESCRIPTION_LIMIT)}...`
      : photo.desc;

  return (
    <div className={`card post-card ${isListView ? "list-view" : ""}`}>
      <img
        src={photo.img}
        className="card-img-top"
        alt={photo.title}
        loading="lazy"
      />

      <div className="card-body">
        <h5 className="card-title">{photo.title}</h5>

        <div className="card-text-wrapper">
          <p className="card-text">
            {truncatedDesc}
            {" "}
            <Link
              to={`/post/${photo.id}`} // This is correct
              className="btn btn-link p-0 read-more-btn"
            >
              Read More
            </Link>
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="author-info">
            <small className="text-muted">
              By{" "}
              <span className="author-name">
                {authorName || "Unknown"}
              </span>
            </small>
          </div>

          {editable && (
            <div className="card-actions">
              <button
                onClick={() => onEdit(photo)}
                className="icon-btn edit-btn"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(photo.id)}
                className="icon-btn delete-btn"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
