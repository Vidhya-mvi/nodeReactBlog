import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, { withCredentials: true });
        setTitle(res.data.title);
        setContent(res.data.content);

        // Show current image preview
        if (res.data.image) setPreview(`http://localhost:5000${res.data.image}`);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview of new image
  };

  // Handle blog update submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Blog updated successfully!");
      navigate("/my-blogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
      alert("Failed to update blog.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "black" }}>Edit Blog</h1>
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

        {/* ✅ Show current or new image preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "10px", borderRadius: "8px" }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
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
