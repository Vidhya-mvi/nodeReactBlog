import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchUserBlogs = async () => {
      setLoading(true);
      try {
        if (!userId || !token) {
          console.error(" No user data or token found!");
          setError("You need to log in first.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/blogs/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else {
          console.error(" Unexpected response data:", res.data);
          setError("Unexpected data format received.");
        }
      } catch (err) {
        console.error(" Error fetching user blogs:", err.response?.data || err.message);
        setError("Looks like you haven't written any blogs yet — start your first one now!");

      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [userId, token]);

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const originalBlogs = [...blogs];
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));

    try {
      const res = await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.status !== 200) throw new Error("Failed to delete blog.");
    } catch (error) {
      console.error(" Error deleting blog:", error.response?.data || error.message);
      alert(`Failed to delete blog: ${error.response?.data?.message || error.message}`);
      setBlogs(originalBlogs); 
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/blogs/comment/${blogId}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updatedBlogs = blogs.map((blog) =>
          blog._id === blogId ? { ...blog, comments: blog.comments.filter((c) => c._id !== commentId) } : blog
        );

        setBlogs(updatedBlogs);
        alert("Comment deleted successfully!");
      } else {
        throw new Error("Failed to delete comment.");
      }
    } catch (error) {
      console.error(" Error deleting comment:", error.response?.data || error.message);
      alert(`Failed to delete comment: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <p style={{ color: "black" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", color: "black" }}>My Blogs</h2>

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
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                transition: "transform 0.2s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {blog.image && (
                <img
                  src={blog.image.startsWith("http") ? blog.image : `http://localhost:5000${blog.image}`}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height:"700px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "0.5rem",
                  }}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              )}

<p style={{ fontSize: "0.8rem", color: "#3498db", fontWeight: "bold" }}>
                Genre: {blog.genre || "Unknown"}
              </p>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", color: "black", marginBottom: "0.5rem" }}>{blog.title}</h3>

              <p style={{ color: "black", fontSize: "1rem", marginBottom: "0.5rem", lineHeight: "1.6", flexGrow: 1 }}>
                {blog.content}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                <span style={{ color: "black", fontSize: "0.9rem" }}> {blog.likes.length} likes</span>
                <span style={{ color: "black", fontSize: "0.9rem" }}>
                   {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>

                <div>
                  <button
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      marginRight: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/edit/${blog._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      backgroundColor: "#EF4444",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteBlog(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h4 style={{ marginTop: "1rem", color: "#444" }}>Comments</h4>
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div key={comment._id} style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <p style={{ color: "black" }}>
                      <strong>{comment.postedBy.username}:</strong> {comment.text}
                    </p>
                    {comment.postedBy._id === userId && (
                      <button
                        style={{ backgroundColor: "#EF4444", color: "#fff", padding: "0.3rem 0.6rem", borderRadius: "5px" }}
                        onClick={() => handleDeleteComment(blog._id, comment._id)}
                      >
                        Delete Comment
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: "#777" }}>No comments yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
