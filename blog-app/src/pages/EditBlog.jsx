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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log(`🔍 Fetching blog data for ID: ${id}`);
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, { withCredentials: true });

        setTitle(res.data.title);
        setContent(res.data.content);

        // Set image preview if it exists
        if (res.data.image) {
          setPreview(`http://localhost:5000${res.data.image}`);
        }

        console.log("✅ Blog data fetched:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Handle form submission (updating the blog)
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      console.log("🚀 Updating blog...");

      await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Blog updated successfully!");
      navigate("/my-blogs");
    } catch (err) {
      console.error("❌ Failed to update blog:", err);
      alert("Failed to update blog.");
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Loading and error handling
  if (loading) return <p style={{ color: "black" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "black" }}>Edit Blog</h1>

      <form onSubmit={handleUpdate}>
        {/* Title Input */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", color: "white" }}
        />

        {/* Content Input */}
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
          style={{ width: "100%", marginBottom: "10px", color: "white" }}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "10px", color: "black" }}
        />

        {/* Show Current or New Image Preview */}
        {preview && (
          <div style={{ marginBottom: "10px" }}>
            <p style={{ color: "black" }}>Image Preview:</p>
            <img
              src={preview}
              alt="Blog preview"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        {/* Update Button */}
        <button
          type="submit"
          style={{
            cursor: "pointer",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
