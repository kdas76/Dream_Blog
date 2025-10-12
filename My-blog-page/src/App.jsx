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
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [isViewChanging, setIsViewChanging] = useState(false);
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // === Auth States ===
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [authView, setAuthView] = useState(null); // "login" | "signup" | null

  const POSTS_PER_PAGE = 9;

  // === Fetch posts ===
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/posts", {
        params: { page, limit: POSTS_PER_PAGE, query },
      });

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
  }, [page, query]);

  // === Delete Post ===
  const handleDelete = async (postId) => {
    if (!user) return alert("You must be logged in to delete posts.");
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
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

  // === Change grid/list view with animation ===
  const handleViewChange = (newView) => {
    if (view === newView) return;

    setIsViewChanging(true);

    // This timeout should match the CSS animation duration
    setTimeout(() => {
      setView(newView);
      setTimeout(() => {
        setIsViewChanging(false);
      }, 10); // A small delay to allow React to re-render before removing the class
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
    <div className={`app ${dark ? "dark" : ""}`}>
      {/* ===== HEADER ===== */}
      <header className="header shadow-sm py-3 px-4">
        <div className="container-fluid">
          <div className="header-box d-flex justify-content-between align-items-center flex-wrap">
            <h1 className="mb-0">Dream Blogger</h1>

            {/* Search */}
            <div className="search-bar flex-grow-1 mx-md-4 my-2 my-md-0">
              <form onSubmit={handleSearch} className="d-flex">
                <input
                  type="text"
                  className="form-control rounded-pill"
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
                onClick={() => handleViewChange(view === "grid" ? "list" : "grid")}
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
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
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
        <div className="container-fluid shadow-sm mt-0">
          <div className={`posts ${view} ${isViewChanging ? 'view-changing' : ''} row`}>
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
                    onEdit={user && p.user_id === user.id ? setEditingPost : null}
                    onDelete={user && p.user_id === user.id ? handleDelete : null}
                    editable={user && p.user_id === user.id}
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
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

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
