import React from "react";
import { useNavigate } from "react-router-dom";

const BlogList = ({ blogs, user, onLike, onComment }) => {
  const navigate = useNavigate();

  if (!blogs.length) return <h3>No blogs found...</h3>;

  return (
    <div>
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

          {user ? (
            <button onClick={() => onLike(blog._id)} style={{ cursor: "pointer" }}>
              {blog.likes.includes(user._id) ? "❤️ Liked" : "🤍 Like"}
            </button>
          ) : (
            <p style={{ color: "gray" }}>Log in to like</p>
          )}

          {user ? (
            <input
              type="text"
              placeholder="Add a comment"
              onKeyDown={(e) => e.key === "Enter" && onComment(blog._id, e.target.value)}
            />
          ) : (
            <p style={{ color: "gray" }}>Log in to comment</p>
          )}

          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>
                {comment.text} - {comment.postedBy?.username}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
