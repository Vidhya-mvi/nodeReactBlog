import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  // ✅ Like/Unlike functionality
  const handleLike = async () => {
    if (!user) return alert("Please log in to like blogs!");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`,
        {},
        { withCredentials: true }
      );
      setBlog(res.data);
    } catch (err) {
      console.error("Failed to like blog:", err);
    }
  };

  // 🛠️ Handle adding a comment
  const handleComment = async () => {
    if (!user) return alert("Please log in to comment!");
    if (!commentText.trim()) return alert("Comment cannot be empty!");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/comment/${id}`,
        { text: commentText },
        { withCredentials: true }
      );
      setBlog(res.data);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // 🔥 Handle deleting a comment (only user's comments)
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/blogs/comment/${id}/${commentId}`,
        { withCredentials: true }
      );
      setBlog(res.data);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // 🛠️ Handle loading state
  if (!blog) return <h3>Loading blog details...</h3>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      {/* Blog Title */}
      <h1>{blog.title}</h1>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={`http://localhost:5000${blog.image.replace("\\", "/")}`}
          alt={blog.title}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
      )}

      {/* Blog Content */}
      <p style={{ marginTop: "10px", lineHeight: "1.6" }}>{blog.content}</p>

      {/* Author and Likes */}
      <p>
        By: <strong>{blog.postedBy?.username}</strong> | ❤️ {blog.likes.length}{" "}
        Likes
      </p>

      {/* 👍 Like/Unlike Button */}
      {user ? (
        <button
          onClick={handleLike}
          style={{
            backgroundColor: blog.likes.includes(user._id) ? "#e74c3c" : "#4CAF50",
            color: "#fff",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          {blog.likes.includes(user._id) ? "👎 Unlike" : "👍 Like"}
        </button>
      ) : (
        <p style={{ color: "gray" }}>Log in to like</p>
      )}

      {/* 💬 Comment Input */}
      {user ? (
        <div>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              width: "80%",
              padding: "8px",
              marginRight: "5px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <button
            onClick={handleComment}
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
        <p style={{ color: "gray" }}>Log in to comment</p>
      )}

      {/* 🗨️ Display Comments */}
      <h3 style={{ marginTop: "20px" }}>Comments:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {blog.comments.map((comment) => (
          <li
            key={comment._id}
            style={{
              marginBottom: "10px",
              padding: "5px 10px",
              backgroundColor: "#f4f4f4",
              borderRadius: "5px",
            }}
          >
            <strong>{comment.postedBy?.username}:</strong> {comment.text}
            {user && comment.postedBy._id === user._id && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                style={{
                  marginLeft: "10px",
                  color: "#e74c3c",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ❌ Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetails;
