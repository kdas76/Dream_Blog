// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
// import Pagination from "./components/Pagination";
// import PostCard from "./components/PostCard";
// import EditModal from "./components/EditModal";
// import UploadModal from "./components/UploadModal";
// import axios from "./utils/axiosInstance";
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";

// export default function App() {
//   const POSTS_PER_PAGE = 9;

//   // === Persisted States ===
//   const [dark, setDark] = useState(() => {
//     const saved = localStorage.getItem("theme");
//     return saved ? saved === "dark" : true;
//   });

//   const [view, setView] = useState(() => {
//     return localStorage.getItem("viewMode") || "grid";
//   });

//   // === Other States ===
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isViewChanging, setIsViewChanging] = useState(false);
//   const [query, setQuery] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [editingPost, setEditingPost] = useState(null);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

//   // === Auth ===
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [authView, setAuthView] = useState(null);

//   // === Theme Sync ===
//   useEffect(() => {
//     document.body.classList.toggle("dark", dark);
//     localStorage.setItem("theme", dark ? "dark" : "light");
//   }, [dark]);

//   // === Fetch Posts ===
//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/posts", {
//         params: { page, limit: POSTS_PER_PAGE, query },
//       });

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
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [page, query]);

//   // === Delete Post ===
//   const handleDelete = async (postId) => {
//     if (!user) return alert("You must be logged in to delete posts.");
//     if (window.confirm("Are you sure you want to delete this post?")) {
//       try {
//         await axios.delete(`/posts/${postId}`);
//         fetchPosts();
//       } catch (err) {
//         console.error("Delete failed:", err);
//         alert("Failed to delete post.");
//       }
//     }
//   };

//   // === Upload complete refresh ===
//   const handleUploadFinished = () => {
//     if (page !== 1) setPage(1);
//     else fetchPosts();
//   };

//   // === View Mode Change (Persisted) ===
//   const handleViewChange = (newView) => {
//     if (view === newView) return;
//     setIsViewChanging(true);
//     setTimeout(() => {
//       setView(newView);
//       localStorage.setItem("viewMode", newView);
//       setTimeout(() => setIsViewChanging(false), 10);
//     }, 200);
//   };

//   // === Search ===
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setQuery(searchTerm);
//     if (page !== 1) setPage(1);
//   };

//   // === Logout ===
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <div className="app">
//       {/* ===== HEADER ===== */}
//       <header className="header">
//         <div className="header-box">
//           <h1 className="mb-0">Dream Blogger</h1>

//           {/* Search */}
//           <div className="search-bar">
//             <form onSubmit={handleSearch} className="d-flex">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search for posts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill ms-2"
//               >
//                 Search
//               </button>
//             </form>
//           </div>

//           {/* Controls */}
//           <div className="controls d-flex align-items-center">
//             {user ? (
//               <>
//                 <button
//                   onClick={() => setIsUploadModalOpen(true)}
//                   className="btn btn-success me-2"
//                 >
//                   + Create Post
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
//                 <button
//                   onClick={() => setAuthView("login")}
//                   className="btn btn-outline-primary me-2"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => setAuthView("signup")}
//                   className="btn btn-outline-secondary me-2"
//                 >
//                   Sign Up
//                 </button>
//               </>
//             )}

//             <button
//               onClick={() =>
//                 handleViewChange(view === "grid" ? "list" : "grid")
//               }
//               className="btn btn-outline-secondary me-2"
//               title={`Switch to ${view === "grid" ? "List" : "Grid"} View`}
//             >
//               {view === "grid" ? "☰" : "▦"}
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

//       {/* ===== MAIN CONTENT ===== */}
//       <main className="content-container">
//         {authView === "login" ? (
//           <Login
//             onLoginSuccess={(loggedUser) => {
//               setUser(loggedUser);
//               setAuthView(null);
//             }}
//           />
//         ) : authView === "signup" ? (
//           <Signup />
//         ) : loading ? (
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ minHeight: "60vh" }}
//           >
//             <div className="loader"></div>
//           </div>
//         ) : (
//           <>
//             <div
//               className={`posts ${view} ${
//                 isViewChanging ? "view-changing" : ""
//               } row`}
//             >
//               {posts.length > 0 ? (
//                 posts.map((p) => (
//                   <div
//                     key={p.id}
//                     className={
//                       view === "grid" ? "col-lg-4 col-md-6 mb-4" : "col-12 mb-4"
//                     }
//                   >
//                     <PostCard
//                       photo={p}
//                       view={view}
//                       onEdit={
//                         user && p.user_id === user.id ? setEditingPost : null
//                       }
//                       onDelete={
//                         user && p.user_id === user.id ? handleDelete : null
//                       }
//                       editable={user && p.user_id === user.id}
//                       authorName={p.author_name}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-muted py-5">
//                   <h5>No posts found</h5>
//                   <p>Try creating or searching for a post.</p>
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             <div className="d-flex justify-content-center">
//               <Pagination
//                 currentPage={page}
//                 totalPages={totalPages}
//                 onPageChange={setPage}
//               />
//             </div>
//           </>
//         )}
//       </main>

//       {/* ===== MODALS ===== */}
//       <EditModal
//         post={editingPost}
//         onClose={() => setEditingPost(null)}
//         onUpdate={fetchPosts}
//       />

//       <UploadModal
//         isOpen={isUploadModalOpen}
//         onClose={() => setIsUploadModalOpen(false)}
//         onUploadFinished={handleUploadFinished}
//       />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Pagination from "./components/Pagination";
import PostCard from "./components/PostCard";
import EditModal from "./components/EditModal";
import UploadModal from "./components/UploadModal";
import axios from "./utils/axiosInstance";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

export default function App() {
  const POSTS_PER_PAGE = 9;

  // === Persisted States ===
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  const [view, setView] = useState(() => {
    return localStorage.getItem("viewMode") || "grid";
  });

  const [filter, setFilter] = useState(() => {
    return localStorage.getItem("postFilter") || "all";
  });

  // === Other States ===
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isViewChanging, setIsViewChanging] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // === Auth ===
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [authView, setAuthView] = useState(null);

  // === Theme Sync ===
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // === Auto switch filter if user logs out ===
  useEffect(() => {
    if (!user && filter === "mine") {
      setFilter("all");
      localStorage.setItem("postFilter", "all");
    }
  }, [user, filter]);

  // === Fetch Posts ===
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: POSTS_PER_PAGE, query };

      if (filter === "mine" && user) {
        params.user_id = user.id;
      }
      const res = await axios.get("/posts", { params }); // This now works with the backend change

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
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, query, filter, user]); // ✅ Also re-fetch if user logs in/out

  // === Delete Post ===
  const handleDelete = async (postId) => {
    if (!user) return alert("You must be logged in to delete posts.");
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        //await axios.delete(`/api/posts/${postId}`);
        await axios.delete(`/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete post.");
      }
    }
  };

  // === Upload complete refresh ===
  const handleUploadFinished = () => {
    if (page !== 1) setPage(1);
    else fetchPosts();
  };

  // === View Mode Change (Persisted) ===
  const handleViewChange = (newView) => {
    if (view === newView) return;
    setIsViewChanging(true);
    setTimeout(() => {
      setView(newView);
      localStorage.setItem("viewMode", newView);
      setTimeout(() => setIsViewChanging(false), 10);
    }, 200);
  };

  // === Search ===
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
    if (page !== 1) setPage(1);
  };

  // === Logout ===
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="app">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-box">
          <h1 className="mb-0">Dream Blogger</h1>

          {/* Search */}
          <div className="search-bar">
            <form onSubmit={handleSearch} className="d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Search for posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-pill ms-2"
              >
                Search
              </button>
            </form>
          </div>

          {/* Controls */}
          <div className="controls d-flex align-items-center">
            {user ? (
              <>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn btn-success me-2"
                >
                  + Create Post
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
                <button
                  onClick={() => setAuthView("login")}
                  className="btn btn-outline-primary me-2"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthView("signup")}
                  className="btn btn-outline-secondary me-2"
                >
                  Sign Up
                </button>
              </>
            )}

            <button
              onClick={() =>
                handleViewChange(view === "grid" ? "list" : "grid")
              }
              className="btn btn-outline-secondary me-2"
              title={`Switch to ${view === "grid" ? "List" : "Grid"} View`}
            >
              {view === "grid" ? "☰" : "▦"}
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

      {/* ===== FILTER BUTTONS ===== */}
      <div className="filter-toggle text-center mt-3">
        <button
          className={`btn me-2 ${
            filter === "all" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => { // Simplified onClick
            if (filter !== "all") {
              setFilter("all");
              localStorage.setItem("postFilter", "all");
              setPage(1); // Reset to first page on filter change
            }
          }}
        >
          All
        </button>
        <button
          className={`btn ${
            filter === "mine" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => { // Simplified onClick
            if (!user) return alert("Please login to view your posts.");
            if (filter !== "mine") {
              setFilter("mine");
              localStorage.setItem("postFilter", "mine");
              setPage(1); // Reset to first page on filter change
            }
          }}
        >
          Mine
        </button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="content-container">
        {authView === "login" ? (
          <Login
            onLoginSuccess={(loggedUser) => {
              setUser(loggedUser);
              setAuthView(null);
            }}
          />
        ) : authView === "signup" ? (
          <Signup />
        ) : loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="loader"></div>
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
                      view === "grid" ? "col-lg-4 col-md-6 mb-4" : "col-12 mb-4"
                    }
                  >
                    <PostCard
                      photo={p}
                      view={view}
                      onEdit={
                        user && p.user_id === user.id ? setEditingPost : null
                      }
                      onDelete={
                        user && p.user_id === user.id ? handleDelete : null
                      }
                      editable={user && p.user_id === user.id}
                      authorName={p.author_name}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5">
                  <h5>No posts found</h5>
                  <p>Try creating or searching for a post.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </main>

      {/* ===== MODALS ===== */}
      <EditModal
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onUpdate={fetchPosts}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadFinished={handleUploadFinished}
      />
    </div>
  );
}
