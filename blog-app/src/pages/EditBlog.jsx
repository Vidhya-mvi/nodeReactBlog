import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


const Spinner = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <div className="spinner" />
    <p>Loading...</p>
    <style>
      {`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border-left-color: #4CAF50;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log(`🔍 Fetching blog data for ID: ${id}`);
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          withCredentials: true,
        });

        setTitle(res.data.title);
        setContent(res.data.content);
        setOriginalTitle(res.data.title);
        setOriginalContent(res.data.content);

        if (res.data.image) {
          setPreview(`http://localhost:5000${res.data.image}`);
        }

        console.log(" Blog data fetched:", res.data);
      } catch (err) {
        console.error(" Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

 
  const handleReset = () => {
    setTitle(originalTitle);
    setContent(originalContent);
    setImage(null);
    setPreview(preview);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      console.log(" Updating blog...");

      await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(" Blog updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(" Failed to update blog:", err);
      alert("Failed to update blog.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => navigate("/");


  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  
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
          style={{ width: "100%", marginBottom: "10px", color: "black" }}
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
          style={{ width: "100%", marginBottom: "10px", color: "black" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "10px", color: "black" }}
        />

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

       
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              cursor: updating ? "wait" : "pointer",
              padding: "10px 20px",
              backgroundColor: updating ? "#ddd" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Blog"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              cursor: "pointer",
              padding: "10px 20px",
              backgroundColor: "#FFA500",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Undo Changes
          </button>

        
          <button
            type="button"
            onClick={handleCancel}
            style={{
              cursor: "pointer",
              padding: "10px 20px",
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
