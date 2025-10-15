// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./App.css";
// import Pagination from "./components/Pagination";
// import PostCard from "./components/PostCard";
// import PostModal from "./components/PostModal";
// import axios from "./utils/axiosInstance";
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import VerifyEmail from "./components/Auth/VerifyEmail";
// import PostPage from "./components/PostPage";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// // ===== MAIN APP CONTENT =====
// function AppContent() {
//   const POSTS_PER_PAGE = 9;
//   const location = useLocation();

//   // === THEME & UI ===
//   const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
//   const [view, setView] = useState(localStorage.getItem("viewMode") || "grid");
//   const [filter, setFilter] = useState(localStorage.getItem("postFilter") || "all");

//   // === APP STATE ===
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [query, setQuery] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isViewChanging, setIsViewChanging] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [editingPost, setEditingPost] = useState(null);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

//   // === AUTH ===
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

//   // === THEME HANDLING ===
//   useEffect(() => {
//     document.body.classList.toggle("dark", dark);
//     localStorage.setItem("theme", dark ? "dark" : "light");
//   }, [dark]);

//   // === FETCH POSTS ===
//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const params = { page, limit: POSTS_PER_PAGE, query };
//       if (filter === "mine" && user) params.user_id = user.id;

//       const res = await axios.get("/posts", { params });
//       const data = (res.data.posts || []).map((p) => ({
//         id: p.id,
//         img: p.image_url
//           ? `http://localhost:5000${p.image_url}`
//           : "https://via.placeholder.com/300x200?text=No+Image",
//         title: p.title || "Untitled Post",
//         desc: p.description || "No description available.",
//         user_id: p.user_id,
//         author_name: p.author_name,
//       }));

//       setPosts(data);
//       setTotalPages(res.data.totalPages || 1);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [page, query, filter, user]);

//   // === DELETE POST ===
//   const handleDelete = async (postId) => {
//     if (!user) return alert("Please log in first.");
//     if (window.confirm("Are you sure you want to delete this post?")) {
//       try {
//         await axios.delete(`/posts/${postId}`);
//         fetchPosts();
//       } catch (err) {
//         console.error("Delete failed:", err);
//       }
//     }
//   };

//   // === SEARCH ===
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setQuery(searchTerm);
//     if (page !== 1) setPage(1);
//   };

//   // === VIEW SWITCH ===
//   const toggleView = (newView) => {
//     if (view === newView) return;
//     setIsViewChanging(true);
//     setTimeout(() => {
//       setView(newView);
//       localStorage.setItem("viewMode", newView);
//       setIsViewChanging(false);
//     }, 200);
//   };

//   // === LOGOUT ===
//   const handleLogout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <div className={`min-h-screen font-sans transition-colors duration-300 ${dark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>


//     {/* <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors duration-300"> */}
//       {/* ===== HEADER ===== */}
//       <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/80">
//         <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
//           <h1 className="mb-0 text-2xl font-bold text-blue-600 dark:text-blue-400">
//             Dream Blogger
//           </h1>

//           {/* === Search Bar === */}
//           <form onSubmit={handleSearch} className="flex-grow max-w-md mx-8 hidden sm:flex">
//             <input
//               type="text"
//               placeholder="Search for posts..."
//               className="form-control"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button
//               type="submit" // This was missing a type
//               className="btn btn-primary rounded-pill ms-2"
//             >
//               <i className="bi bi-search"></i>
//             </button>
//           </form>

//           {/* === Controls === */}
//           <div className="flex items-center gap-2">
//             {user ? (
//               <>
//                 <button
//                   onClick={() => setIsUploadModalOpen(true)}
//                   className="btn btn-success me-2"
//                 >
//                   + New Post
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="btn btn-outline-danger me-2"
//                 >
//                   Logout ({user.name})
//                 </button>
//               </>
//             ) : (
//               <>
//                 <a href="/login" className="btn btn-outline-primary me-2">
//                   Login
//                 </a>
//                 <a href="/signup" className="btn btn-outline-secondary me-2">
//                   Sign Up
//                 </a>
//               </>
//             )}

//             <button
//               onClick={() => toggleView(view === "grid" ? "list" : "grid")}
//               className="btn btn-outline-secondary me-2"
//               title={`Switch to ${view === "grid" ? "List" : "Grid"} view`}
//             >
//               {view === "grid" ? (
//                 <i className="bi bi-list-task"></i>
//               ) : (
//                 <i className="bi bi-grid-3x3-gap"></i>
//               )}
//             </button>

//             <button
//               onClick={() => setDark(!dark)}
//               className="btn btn-outline-secondary"
//               title="Toggle Theme"
//             >
//               {dark ? "☀️" : "🌙"}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ===== FILTER TOGGLE ===== */}
//       {user && location.pathname === "/" && (
//         <div className="text-center my-6">
//           <button
//             className={`btn me-2 ${
//               filter === "all" ? "btn-primary" : "btn-outline-primary"
//             }`}
//             onClick={() => {
//               setFilter("all");
//               localStorage.setItem("postFilter", "all");
//               setPage(1);
//             }}
//           >
//             All
//           </button>
//           <button
//             className={`btn ${
//               filter === "mine" ? "btn-primary" : "btn-outline-primary"
//             }`}
//             onClick={() => {
//               if (!user) return alert("Login to view your posts.");
//               setFilter("mine");
//               localStorage.setItem("postFilter", "mine");
//               setPage(1);
//             }}
//           >
//             Mine
//           </button>
//         </div>
//       )}

//       {/* ===== MAIN CONTENT ===== */}
//       <main className="max-w-7xl mx-auto px-6 pb-12">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               loading ? (
//                 <div className="flex justify-center items-center min-h-[50vh]">
//                   <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div
//                     className={`posts ${view} ${
//                       isViewChanging ? "view-changing" : ""
//                     } row`}
//                   >
//                     {posts.length > 0 ? (
//                       posts.map((p) => (
//                         <div
//                           key={p.id}
//                           className={
//                             view === "grid"
//                               ? "col-lg-4 col-md-6 mb-4 d-flex align-items-stretch"
//                               : "col-12 mb-4"
//                           }
//                         >
//                           <PostCard
//                             photo={p}
//                             view={view}
//                             onEdit={
//                               user && p.user_id === user.id
//                                 ? setEditingPost
//                                 : null
//                             }
//                             onDelete={
//                               user && p.user_id === user.id
//                                 ? handleDelete
//                                 : null
//                             }
//                             editable={user && p.user_id === user.id}
//                             authorName={p.author_name}
//                           />
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-center text-muted py-5">
//                         <h5 className="text-xl font-semibold">No posts found</h5>
//                         <p>Try searching or creating one.</p>
//                       </div>
//                     )}
//                   </div>

//                   <Pagination
//                     currentPage={page}
//                     totalPages={totalPages}
//                     onPageChange={setPage}
//                   />
//                 </>
//               )
//             }
//           />

//           {/* === SINGLE POST === */}
//           <Route path="/post/:id" element={<PostPage />} />

//           {/* === AUTH === */}
//           <Route
//             path="/login"
//             element={<Login onLoginSuccess={(user) => setUser(user)} />}
//           />
//           <Route
//             path="/signup"
//             element={<Signup onLoginSuccess={(user) => setUser(user)} />}
//           />
//           <Route path="/verify/:token" element={<VerifyEmail />} />
//         </Routes>
//       </main>

//       {/* === MODALS === */}
//       {editingPost && (
//         <PostModal
//           mode="edit"
//           post={editingPost}
//           isOpen={!!editingPost}
//           onClose={() => setEditingPost(null)}
//           onSubmit={fetchPosts}
//         />
//       )}
//       {isUploadModalOpen && (
//         <PostModal
//           mode="create"
//           isOpen={isUploadModalOpen}
//           onClose={() => setIsUploadModalOpen(false)}
//           onSubmit={fetchPosts}
//         />
//       )}
//     </div>
//   );
// }

// // ===== ROOT APP WRAPPER =====
// export default function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }







import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import "./index.css"
import Pagination from "./components/Pagination";
import PostCard from "./components/PostCard";
import PostModal from "./components/PostModal";
import axios from "./utils/axiosInstance";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import VerifyEmail from "./components/Auth/VerifyEmail";
import PostPage from "./components/PostPage";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function AppContent() {
  const POSTS_PER_PAGE = 9;
  const location = useLocation();

  // === THEME & UI ===
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [view, setView] = useState(localStorage.getItem("viewMode") || "grid");
  const [filter, setFilter] = useState(localStorage.getItem("postFilter") || "all");

  // === APP STATE ===
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewChanging, setIsViewChanging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // === AUTH ===
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // === THEME HANDLING ===
  useEffect(() => {
    // For Tailwind CSS
    document.body.classList.toggle("dark", dark);
    // For Bootstrap
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // === FETCH POSTS ===
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: POSTS_PER_PAGE, query };
      if (filter === "mine" && user) params.user_id = user.id;

      const res = await axios.get("/posts", { params });
      const data = (res.data.posts || []).map((p) => ({
        id: p.id,
        img: p.image_url
          ? `http://localhost:5000${p.image_url}`
          : "https://via.placeholder.com/300x200?text=No+Image",
        title: p.title || "Untitled Post",
        desc: p.description || "No description available.",
        user_id: p.user_id,
        author_name: p.author_name,
      }));

      setPosts(data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, query, filter, user]);

  // === DELETE POST ===
  const handleDelete = async (postId) => {
    if (!user) return alert("Please log in first.");
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // === SEARCH ===
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
    if (page !== 1) setPage(1);
  };

  // === VIEW SWITCH ===
  const toggleView = (newView) => {
    if (view === newView) return;
    setIsViewChanging(true);
    setTimeout(() => {
      setView(newView);
      localStorage.setItem("viewMode", newView);
      setIsViewChanging(false);
    }, 200);
  };

  // === LOGOUT ===
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        dark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
          <h1 className="mb-0 text-2xl font-bold text-blue-600 dark:text-blue-400">
            DreamBlogger
          </h1>

          {/* === Search Bar === */}
          <form onSubmit={handleSearch} className="flex-grow max-w-md mx-8 hidden sm:flex">
            <input
              type="text"
              placeholder="Search for posts..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-pill ms-2">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* === Controls === */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-success me-2"
                >
                  + New Post
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger me-2"
                >
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn btn-outline-primary me-2">
                  Login
                </a>
                <a href="/signup" className="btn btn-outline-secondary me-2">
                  Sign Up
                </a>
              </>
            )}

            <button
              onClick={() => toggleView(view === "grid" ? "list" : "grid")}
              className="btn btn-outline-secondary me-2"
              title={`Switch to ${view === "grid" ? "List" : "Grid"} view`}
            >
              {view === "grid" ? (
                <i className="bi bi-list-task"></i>
              ) : (
                <i className="bi bi-grid-3x3-gap"></i>
              )}
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="btn btn-outline-secondary"
              title="Toggle Theme"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* ===== FILTER TOGGLE ===== */}
      {user && location.pathname === "/" && (
        <div className="text-center my-6">
          <button
            className={`btn me-2 ${
              filter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              setFilter("all");
              localStorage.setItem("postFilter", "all");
              setPage(1);
            }}
          >
            All
          </button>
          <button
            className={`btn ${
              filter === "mine" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => {
              if (!user) return alert("Login to view your posts.");
              setFilter("mine");
              localStorage.setItem("postFilter", "mine");
              setPage(1);
            }}
          >
            Mine
          </button>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <div
                    className={`posts ${view} ${
                      isViewChanging ? "view-changing" : ""
                    } row`}
                  >
                    {posts.length > 0 ? (
                      posts.map((p) => (
                        <div
                          key={p.id}
                          className={
                            view === "grid"
                              ? "col-lg-4 col-md-6 mb-4 flex items-stretch"
                              : "col-12 mb-4 flex"
                          }
                        >
                          <PostCard
                            photo={p}
                            view={view}
                            dark={dark}
                            onEdit={user && p.user_id === user.id ? setEditingPost : null}
                            onDelete={user && p.user_id === user.id ? handleDelete : null}
                            editable={user && p.user_id === user.id}
                            authorName={p.author_name}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted py-5">
                        <h5 className="text-xl font-semibold">No posts found</h5>
                        <p>Try searching or creating one.</p>
                      </div>
                    )}
                  </div>

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              )
            }
          />

          {/* === SINGLE POST === */}
          <Route path="/post/:id" element={<PostPage dark={dark} />} />

          {/* === AUTH === */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={(user) => setUser(user)} />}
          />
          <Route
            path="/signup"
            element={<Signup onLoginSuccess={(user) => setUser(user)} />}
          />
          <Route path="/verify/:token" element={<VerifyEmail />} />
        </Routes>
      </main>

      {/* === MODALS === */}
      {editingPost && (
        <PostModal
          mode="edit"
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSubmit={fetchPosts}
        />
      )}
      {isUploadModalOpen && (
        <PostModal
          mode="create"
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={fetchPosts}
        />
      )}
    </div>
  );
}

// ===== ROOT APP WRAPPER =====
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
