import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch user-specific blogs on mount
  useEffect(() => {
    const fetchMyBlogs = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get("http://localhost:5000/api/blogs/myblogs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchMyBlogs();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <h2 style={styles.heading}>My Blogs</h2>
      {blogs.length ? (
        <div style={styles.blogGrid}>
          {blogs.map((blog) => (
            <div key={blog._id} style={styles.blogCard}>
              <h3 style={styles.blogTitle}>{blog.title}</h3>
              <p style={styles.blogExcerpt}>
                {blog.content.slice(0, 100)}...
              </p>
              <Link to={`/blog/${blog._id}`} style={styles.link}>
                Read More
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noBlogs}>You haven't written any blogs yet!</p>
      )}
    </div>
  );
};

// 🎯 Inline CSS Styles
const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh", // Minimum height to ensure page stretches
    width: "100vw",
    padding: "20px",
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #f4f4f4, #ddd)",
    color: "#333",
    fontFamily: "'Arial', sans-serif",
    overflowX: "hidden", // Prevent horizontal scroll
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    fontWeight: "bold",
    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
    justifyContent: "center",
  },
  blogCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  blogCardHover: {
    transform: "translateY(-5px)",
  },
  blogTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#4a4a4a",
  },
  blogExcerpt: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "10px",
  },
  link: {
    color: "#4caf50",
    textDecoration: "none",
    fontWeight: "bold",
  },
  noBlogs: {
    fontSize: "1.2rem",
    color: "#666",
    marginTop: "20px",
  },
};

export default MyBlogs;
