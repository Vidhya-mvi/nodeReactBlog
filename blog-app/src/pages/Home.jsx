import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [showComments, setShowComments] = useState({});
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

  // 💬 Handle typing into comment input fields
  const handleInputChange = (id, value) => {
    setCommentText((prev) => ({ ...prev, [id]: value }));
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

      // ✅ Update the blog's comments directly without refetching
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id ? { ...blog, comments: res.data.comments } : blog
        )
      );

      // ✅ Clear the input field after a successful comment
      setCommentText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  // 🔥 Toggle "Show More/Less"
  const toggleExpand = (id) => {
    setExpandedBlogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🎯 Toggle Show/Hide Comments
  const toggleComments = (id) => {
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🎯 If blogs are loading or empty
  if (!blogs.length) return <h3 style={{ color: "black" }}>Loading blogs...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "black" }}>Latest Blogs</h1>

      {/* ✅ Grid layout setup */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              width: "450px",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => navigate(`/blogs/${blog._id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {blog.image && (
              <img
                src={blog.image.startsWith("http") ? blog.image : `http://localhost:5000${blog.image}`}
                alt={blog.title}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  backgroundColor: "#f0f0f0",
                }}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            )}

            {/* Blog Info */}
            <div style={{ padding: "10px" }}>
              <h2 style={{ fontSize: "1rem", color: "#333" }}>{blog.title}</h2>

              {/* ✅ Show More / Show Less */}
              <p style={{ color: "#555", fontSize: "0.8rem" }}>
                {expandedBlogs[blog._id] || blog.content.length <= 80
                  ? blog.content
                  : `${blog.content.substring(0, 80)}... `}
                {blog.content.length > 80 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(blog._id);
                    }}
                    style={{
                      background: "none",
                      color: "#3498db",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                    }}
                  >
                    {expandedBlogs[blog._id] ? "Show Less" : "Show More"}
                  </button>
                )}
              </p>

              {/* Blog meta */}
              <p style={{ fontSize: "0.8rem", color: "#777" }}>
                By: <strong>{blog.postedBy?.username}</strong> | ❤️ {blog.likes.length} Likes
              </p>

              {/* Like Button */}
              {user ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(blog._id);
                  }}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  👍 Like
                </button>
              ) : (
                <p style={{ color: "gray", fontSize: "0.8rem" }}>Log in to like</p>
              )}

              {/* 📝 Comment Input */}
              {user && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[blog._id] || ""}
                    onChange={(e) => handleInputChange(blog._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "70%",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      fontSize: "0.8rem",
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComment(blog._id);
                    }}
                    style={{
                      padding: "5px 7px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#3498db",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    💬
                  </button>
                </div>
              )}

              {/* 🗨️ Show/Hide Comments */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComments(blog._id);
                }}
                style={{ background: "none", color: "#3498db", border: "none", cursor: "pointer" }}
              >
                {showComments[blog._id] ? "Hide Comments" : "Show Comments"}
              </button>

              {showComments[blog._id] &&
                blog.comments.map((comment, index) => (
                  <p key={index} style={{ fontSize: "0.8rem", color: "#555" }}>
                    🗨️ {comment.text} - <strong>{comment.username}</strong>
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
