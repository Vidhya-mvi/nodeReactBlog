import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/admin/users", { withCredentials: true });
        setUsers(userRes.data);

        const blogRes = await axios.get("http://localhost:5000/api/blogs", { withCredentials: true });
        setBlogs(blogRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, { withCredentials: true });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.username} ({user.role})</li>
        ))}
      </ul>

      <h2>All Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog._id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
          <h2>{blog.title}</h2>
          <p>{blog.content.substring(0, 100)}...</p>
          <button onClick={() => handleDeleteBlog(blog._id)}>Delete Blog</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
