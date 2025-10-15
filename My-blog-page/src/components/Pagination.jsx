// import React, { useCallback } from "react";
// import PropTypes from "prop-types";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   const getPageNumbers = () => {
//     const pages = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       if (currentPage > 4) pages.push("...");
//       const startPage = Math.max(2, currentPage - 1);
//       const endPage = Math.min(totalPages - 1, currentPage + 1);
//       for (let i = startPage; i <= endPage; i++) pages.push(i);
//       if (currentPage < totalPages - 3) pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   const handlePrev = useCallback(() => {
//     if (currentPage > 1) onPageChange(currentPage - 1);
//   }, [currentPage, onPageChange]);

//   const handleNext = useCallback(() => {
//     if (currentPage < totalPages) onPageChange(currentPage + 1);
//   }, [currentPage, totalPages, onPageChange]);

//   return (
//     <div className="flex flex-wrap justify-center gap-2 mt-10">
//       {/* Prev */}
//       <button
//         onClick={handlePrev}
//         disabled={currentPage === 1}
//         className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
//           currentPage === 1
//             ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
//             : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
//         }`}
//       >
//         ← Prev
//       </button>

//       {/* Page Numbers */}
//       {pageNumbers.map((page, idx) =>
//         page === "..." ? (
//           <span
//             key={idx}
//             className="px-3 py-2 text-slate-400 dark:text-slate-500"
//           >
//             ...
//           </span>
//         ) : (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`rounded-md border px-4 py-2 text-sm font-semibold transition-all ${
//               currentPage === page
//                 ? "border-blue-600 bg-blue-600 text-white shadow-md"
//                 : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
//             }`}
//           >
//             {page}
//           </button>
//         )
//       )}

//       {/* Next */}
//       <button
//         onClick={handleNext}
//         disabled={currentPage === totalPages}
//         className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
//           currentPage === totalPages
//             ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
//             : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
//         }`}
//       >
//         Next →
//       </button>
//     </div>
//   );
// }

// Pagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
// };








import React, { useCallback } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-10">
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
          currentPage === 1
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
            : "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span
            key={idx}
            className="px-3 py-2 text-slate-400 dark:text-slate-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition-all ${
              currentPage === page
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
          currentPage === totalPages
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
            : "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        Next →
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
