import React from "react";

export default function Modal({ photo, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src.large} alt={photo.alt} className="rounded-lg w-full mb-4" />
        <h2 className="text-xl font-bold mb-1">{photo.title}</h2>
        <p className="text-sm opacity-80 mb-2">{photo.desc}</p>
        <a
          href={photo.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          View on Pexels →
        </a>
        <button onClick={onClose} className="close-btn mt-4">Close</button>
      </div>
    </div>
  );
}
