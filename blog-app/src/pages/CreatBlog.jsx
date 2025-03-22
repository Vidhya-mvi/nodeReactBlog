import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
  
    try {
      const res = await axios.post(
        "http://localhost:5000/api/blogs", // ✅ Ensure this is correct
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Blog created successfully!");
      navigate(`/blogs/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog");
      console.error("Failed to create blog:", err);
    }
  };
  
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create a New Blog</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />
        <br />
        <input type="file" onChange={handleImageChange} />
        <br />
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;
