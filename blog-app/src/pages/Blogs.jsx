import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/blogs/like/${id}`, {}, { withCredentials: true });
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === id ? { ...blog, likes: [...blog.likes, "newLike"] } : blog))
      );
    } catch (err) {
      console.error("Failed to like blog:", err);
    }
  };

  const handleComment = async (id, commentText) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/comment/${id}`,
        { text: commentText },
        { withCredentials: true }
      );
      setBlogs((prev) => prev.map((blog) => (blog._id === id ? res.data : blog)));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (!blogs.length) return <h3>Loading blogs...</h3>;

  return (
    <div>
      <h1>All Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id} style={{ borderBottom: "1px solid #ddd", marginBottom: "10px", paddingBottom: "10px" }}>
          <h2 onClick={() => navigate(`/blogs/${blog._id}`)} style={{ cursor: "pointer", color: "blue" }}>
            {blog.title}
          </h2>
          {blog.image && (
            <img
              src={`http://localhost:5000${blog.image}`}
              alt={blog.title}
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
          )}
          <p>{blog.content}</p>
          <p>By: {blog.postedBy.username}</p>
          <p>Likes: {blog.likes.length}</p>

          <button onClick={() => handleLike(blog._id)} style={{ cursor: "pointer" }}>
            ❤️ Like
          </button>

          <input
            type="text"
            placeholder="Add a comment"
            onKeyDown={(e) => e.key === "Enter" && handleComment(blog._id, e.target.value)}
          />
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment.text} - {comment.postedBy?.username}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
