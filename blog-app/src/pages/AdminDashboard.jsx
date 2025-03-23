import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Users and Blogs Data
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [userRes, blogRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/blogs", {
            withCredentials: true,
          }),
        ]);

        console.log("✅ Users Data:", userRes.data);
        console.log("✅ Blogs Data:", blogRes.data);

        setUsers(userRes.data || []);
        setBlogs(blogRes.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch admin data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle Blog Deletion
  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        withCredentials: true,
      });
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error("❌ Failed to delete blog:", err);
      setError("Failed to delete the blog. Try again.");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>

      {error && <p style={styles.error}>{error}</p>}

      {/* Users Section */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Users</h2>
        {users.length > 0 ? (
          <ul style={styles.list}>
            {users.map((user) => (
              <li key={user._id} style={styles.listItem}>
                {user.username} (<strong>{user.role}</strong>)
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noData}>No users found.</p>
        )}
      </div>

      {/* Blogs Section */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}>All Blogs</h2>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} style={styles.blogCard}>
              <h3 style={styles.blogTitle}>{blog.title}</h3>
              <p style={styles.blogContent}>
                {blog.content.substring(0, 100)}...
              </p>
              <button
                onClick={() => handleDeleteBlog(blog._id)}
                style={styles.deleteButton}
              >
                Delete Blog
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noData}>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

// 🎨 Inline CSS Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  section: {
    marginBottom: "30px",
  },
  subHeader: {
    fontSize: "24px",
    color: "#444",
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
    marginBottom: "10px",
  },
  list: {
    listStyle: "none",
    padding: "0",
  },
  listItem: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
  blogCard: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  blogTitle: {
    fontSize: "20px",
    color: "#555",
  },
  blogContent: {
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "3px",
    fontWeight: "bold",
  },
  noData: {
    color: "#777",
    fontStyle: "italic",
  },
};

export default AdminDashboard;
