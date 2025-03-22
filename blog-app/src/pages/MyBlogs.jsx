import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs posted yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <h2>{blog.title}</h2>
            <p>{blog.content.substring(0, 100)}...</p>
            <Link to={`/blogs/${blog._id}`}>Read More</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBlogs;
