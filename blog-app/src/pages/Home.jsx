import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Check if user is logged in

  // 🛠️ Fetch all blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data); // ✅ Set fetched blogs to state
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // ❤️ Handle like functionality
  const handleLike = async (id) => {
    if (!user) return alert("Please log in to like blogs!");
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`,
        {},
        { withCredentials: true }
      );
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id
            ? { ...blog, likes: [...blog.likes, user._id] }
            : blog
        )
      );
    } catch (err) {
      console.error("Failed to like blog:", err);
    }
  };

  // 💬 Handle comment functionality
  const handleComment = async (id, commentText) => {
    if (!user) return alert("Please log in to comment!");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/comment/${id}`,
        { text: commentText },
        { withCredentials: true }
      );
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === id ? res.data : blog))
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // 📌 If blogs are loading or empty
  if (!blogs.length) return <h3>Loading blogs...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Latest Blogs</h1>
      {blogs.map((blog) => (
        <div
          key={blog._id}
          style={{
            borderBottom: "1px solid #ddd",
            marginBottom: "20px",
            paddingBottom: "15px",
          }}
        >
          {/* Blog Title */}
          <h2
            onClick={() => navigate(`/blogs/${blog._id}`)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {blog.title}
          </h2>

          {/* Blog Image */}
          {blog.image && (
            <img
              src={`http://localhost:5000${blog.image}`}
              alt={blog.title}
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
          )}

          {/* Blog Content Preview */}
          <p>{blog.content.substring(0, 150)}...</p>

          {/* Posted By */}
          <p>
            By: <strong>{blog.postedBy?.username}</strong>
          </p>

          {/* Likes Count */}
          <p>❤️ {blog.likes.length} Likes</p>

          {/* Like Button */}
          {user ? (
            <button
              onClick={() => handleLike(blog._id)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            >
              👍 Like
            </button>
          ) : (
            <p style={{ color: "gray" }}>Log in to like</p>
          )}

          {/* Comment Section */}
          {user ? (
            <>
              <input
                type="text"
                placeholder="Add a comment"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleComment(blog._id, e.target.value)
                }
              />
            </>
          ) : (
            <p style={{ color: "gray" }}>Log in to comment</p>
          )}

          {/* Display Comments */}
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>
                <strong>{comment.postedBy?.username}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Home;
