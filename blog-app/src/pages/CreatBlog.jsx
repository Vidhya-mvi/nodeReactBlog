import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const genres = [
  "Technology",
  "Travel",
  "Food",
  "Lifestyle",
  "Education",
  "Anime",
  "Books",
  "Movies",
  "Games",
  "Fitness",
  "Personal Development",
  "Health",
  "Finance",
  "Art",
  "Manhwa",
];

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [genre, setGenre] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // Handle image file selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Generate a preview URL for the image
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !genre) {
      alert("Please fill in all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("genre", genre);
    if (image) formData.append("image", image);

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsUploading(false);
      navigate("/");
    } catch (err) {
      console.error("Failed to create blog:", err.response?.data?.message);
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create a New Blog</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        {/* Content */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...styles.input, height: "200px" }}
        />

        {/* Genre Dropdown */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />

        {/* Live Image Preview */}
        {imagePreview && (
          <div style={styles.imagePreviewContainer}>
            <img
              src={imagePreview}
              alt="Preview"
              style={styles.imagePreview}
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={isUploading} style={styles.button}>
          {isUploading ? "Publishing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

// 💅 Improved Dynamic Layout CSS
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Allow content to grow downward
    minHeight: "100vh", // Use minHeight instead of height
    width: "100vw",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    padding: "20px 0",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px",
    fontWeight: "bold",
    textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "60%",
    maxWidth: "600px",
    background: "rgba(0, 0, 0, 0.7)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.6)",
  },
  input: {
    padding: "15px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
  },
  fileInput: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#ddd",
    fontSize: "1rem",
    cursor: "pointer",
  },
  button: {
    padding: "15px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "0.3s ease",
  },
  imagePreviewContainer: {
    marginTop: "15px",
    textAlign: "center",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  },
};

export default CreateBlog;
