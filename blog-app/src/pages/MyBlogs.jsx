import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs/user", { withCredentials: true });
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, { withCredentials: true });
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs posted yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
            <h2>{blog.title}</h2>
            <p>{blog.content.substring(0, 100)}...</p>
            <Link to={`/blogs/${blog._id}`}>Read More</Link>

            {/* Edit Button */}
            <button
              onClick={() => navigate(`/edit-blog/${blog._id}`)}
              style={{ marginLeft: "10px", cursor: "pointer", background: "yellow", padding: "5px 10px" }}
            >
              ✏️ Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(blog._id)}
              style={{ marginLeft: "10px", cursor: "pointer", background: "red", color: "white", padding: "5px 10px" }}
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBlogs;
