import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      console.log("🚀 Sending login data:", formData);
    
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true } // Keep this for cookies
      );
    
      console.log("✅ Login successful:", res.data);
    
      // Check if token exists in response
      const { user, token } = res.data;
    
      if (token) {
        localStorage.setItem("token", token); // ✅ Save token properly
        console.log("✅ Token saved:", token);
      } else {
        console.warn("⚠️ Token missing in response");
      }
    
      localStorage.setItem("user", JSON.stringify(user));
    
      console.log("✅ User saved:", localStorage.getItem("user"));
    
      // Redirect to home page
      navigate("/");
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
    
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }
    
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #a1c4fd, #c2e9fb)", // Soft blue gradient
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Form Container */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          width: "400px",
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#333" }}>Login</h1>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "16px",
            }}
          />

          {/* Login Button with loading animation */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#aaa" : "#6a0572", // Gray while loading
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "transform 0.1s ease",
            }}
            onMouseOver={(e) =>
              !loading && (e.target.style.backgroundColor = "#8a0a92")
            }
            onMouseOut={(e) =>
              !loading && (e.target.style.backgroundColor = "#6a0572")
            }
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Navigation Links */}
        <p style={{ marginTop: "10px", color: "#555" }}>
          <Link to="/" style={{ color: "#6a0572", textDecoration: "none" }}>
            Home
          </Link>
        </p>

        <p style={{ color: "#555" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#6a0572", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
