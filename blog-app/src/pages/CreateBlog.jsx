import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const navigate = useNavigate();

  const genres = [
    "Technology",
    "Health",
    "Lifestyle",
    "Finance",
    "Education",
    "Anime",
    "Books",
    "Art",
    "Manhwa",
  ];


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!genre) {
      setError("Please select a genre");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("genre", genre);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/blogs",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );


      setAlertMessage(" Blog created successfully!");
      setAlertType("success");


      setTimeout(() => setAlertMessage(""), 3000);


      navigate(`/blogs/${res.data._id}`);
    } catch (err) {

      setAlertMessage(err.response?.data?.message || " Failed to create blog");
      setAlertType("error");


      setTimeout(() => setAlertMessage(""), 3000);

      console.error("Failed to create blog:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create a New Blog</h1>


      {alertMessage && (
        <div
          style={{
            ...styles.alert,
            backgroundColor: alertType === "success" ? "#4CAF50" : "#FF4C4C",
          }}
        >
          {alertMessage}
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
          style={styles.textarea}
        />
        <p style={{ color: "#555", fontSize: "0.8rem" }}>
          {content.length}/1000 characters
        </p>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          style={styles.select}
        >
          <option value="" disabled>
            Select a Genre
          </option>
          {genres.map((g, index) => (
            <option key={index} value={g}>
              {g}
            </option>
          ))}
        </select>

        <input type="file" onChange={handleImageChange} style={styles.fileInput} />

        {preview && (
          <div style={styles.previewContainer}>
            <h4 style={{ color: "#333" }}>Image Preview:</h4>
            <img src={preview} alt="Preview" style={styles.previewImage} />
          </div>
        )}

        <button type="submit" style={styles.button}>
          Create Blog
        </button>
      </form>
    </div>
  );
};


const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  alert: {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    animation: "fadein 0.5s, fadeout 0.5s 2.5s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    resize: "none",
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#333",
  },
  fileInput: {
    border: "none",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.2s",
  },
  previewContainer: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  previewImage: {
    width: "100%",
    height: "auto",
    maxHeight: "300px",
    borderRadius: "5px",
    objectFit: "cover",
    marginTop: "5px",
  },
};

export default CreateBlog;
