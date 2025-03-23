import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Extract token and user data from localStorage
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  let userId = null;
  try {
    const parsedUser = JSON.parse(user);
    userId = parsedUser?.id || parsedUser?._id || null;

    if (!userId) throw new Error("User ID not found in localStorage");
    console.log("✅ Extracted userId:", userId);
  } catch (e) {
    console.error("❌ Failed to parse user data:", e);
    setError("User data is invalid or missing. Please log in again.");
    setLoading(false);
  }

  // Fetch user blogs on load
  useEffect(() => {
    const fetchUserBlogs = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!userData || !token) {
          console.error("🚨 No user data or token found!");
          setError("You need to log in first.");
          setLoading(false);
          return;
        }

        console.log(`🚀 Fetching blogs from: /api/blogs/user/${userData.id}`);
        const res = await axios.get(
          `http://localhost:5000/api/blogs/user/${userData.id}`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );

        console.log("✅ User blogs response:", res.data);

        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else {
          console.error("⚠️ Unexpected response data:", res.data);
          setError("Unexpected data format received.");
        }
      } catch (err) {
        console.error("❌ Error fetching user blogs:", err.response?.data || err.message);
        setError("Failed to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
  
    const originalBlogs = [...blogs];
  
    // Optimistically remove blog from UI
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
  
    try {
      console.log(`🗑️ Deleting blog with id: ${id}`);
      const res = await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      console.log("✅ Delete response:", res.data);
  
      if (res.status !== 200) {
        throw new Error("Failed to delete blog.");
      }
  
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting blog:", error.response?.data || error.message);
      alert(`Failed to delete blog: ${error.response?.data?.message || error.message}`);
      setBlogs(originalBlogs); // Rollback UI on error
    }
  };
  

  // Loading and error handling UI
  if (loading) return <p style={{ color: "black" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", color: "black" }}>
        My Blogs
      </h2>

      {blogs.length === 0 ? (
        <p style={{ color: "black" }}>No blogs found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Blog Image */}
              {blog.image && (
                <img
                  src={`http://localhost:5000${blog.image}`}
                  alt={blog.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" }}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              )}

              {/* Blog Title */}
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "black", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {blog.title}
              </h3>

              {/* Blog Content */}
              <p style={{ color: "black", fontSize: "0.9rem", marginBottom: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {blog.content.slice(0, 100)}...
              </p>

              {/* Blog Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "black", fontSize: "0.8rem" }}>
                  ❤️ {blog.likes.length} {blog.likes.length === 1 ? "like" : "likes"}
                </span>

                <span style={{ color: "black", fontSize: "0.8rem" }}>
                  📅 {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {/* Edit & Delete Buttons */}
                <div>
                  <button
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      marginRight: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/edit/${blog._id}`)} // Navigate properly now!
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      backgroundColor: "#EF4444",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
