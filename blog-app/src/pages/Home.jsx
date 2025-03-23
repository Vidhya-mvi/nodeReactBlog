import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch blogs
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

  // ✅ Like functionality
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

  // 🛠️ Improved Comment Handler
  const handleComment = async (id) => {
    const comment = commentText[id];

    if (!user) return alert("Please log in to comment!");
    if (!comment?.trim()) return alert("Comment cannot be empty!");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/comment/${id}`,
        { text: comment },
        { withCredentials: true }
      );

      // ✅ Update blog with new comment
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === id ? res.data : blog))
      );

      // ✅ Clear the comment input after posting
      setCommentText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // 💬 Handle typing into comment input fields
  const handleInputChange = (id, value) => {
    setCommentText((prev) => ({ ...prev, [id]: value }));
  };

  // 🎯 If blogs are loading or empty
  if (!blogs.length) return <h3>Loading blogs...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Latest Blogs</h1>

      {/* ✅ Grid layout setup */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onClick={() => navigate(`/blogs/${blog._id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Blog Image */}
            {blog.image && (
              <img
                src={`http://localhost:5000${blog.image}`}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            )}

            {/* Blog Info */}
            <div style={{ padding: "15px" }}>
              <h2 style={{ fontSize: "1.2rem", color: "#333" }}>{blog.title}</h2>
              <p style={{ color: "#555" }}>{blog.content.substring(0, 100)}...</p>

              {/* Blog meta */}
              <p style={{ fontSize: "0.9rem", color: "#777" }}>
                By: <strong>{blog.postedBy?.username}</strong> | ❤️ {blog.likes.length} Likes
              </p>

              {/* Like Button */}
              {user ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleLike(blog._id);
                  }}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  👍 Like
                </button>
              ) : (
                <p style={{ color: "gray", fontSize: "0.9rem" }}>Log in to like</p>
              )}

              {/* 📝 Comment Input */}
              {user ? (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[blog._id] || ""}
                    onChange={(e) => handleInputChange(blog._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                    style={{
                      width: "80%",
                      padding: "8px",
                      marginRight: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComment(blog._id);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#3498db",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    💬 Comment
                  </button>
                </div>
              ) : (
                <p style={{ color: "gray", fontSize: "0.9rem" }}>Log in to comment</p>
              )}

              {/* 🗨️ Display Comments */}
              <ul style={{ marginTop: "10px", listStyle: "none", padding: 0 }}>
                {blog.comments.map((comment, index) => (
                  <li key={index} style={{ marginBottom: "5px", color: "#444" }}>
                    <strong>{comment.postedBy?.username}:</strong> {comment.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
