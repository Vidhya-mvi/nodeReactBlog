import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, { withCredentials: true });
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content },
        { withCredentials: true }
      );
      alert("Blog updated successfully!");
      navigate("/my-blogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
      alert("Failed to update blog.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Blog</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit" style={{ cursor: "pointer", padding: "10px 20px" }}>
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
