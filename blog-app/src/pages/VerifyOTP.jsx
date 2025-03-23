import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  // If no userId is found, redirect to registration
  if (!userId) {
    navigate("/register");
    return null;
  }

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        userId,
        otp,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
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
        <h1 style={{ marginBottom: "20px", color: "#333" }}>OTP Verification</h1>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength="6"
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "16px",
              textAlign: "center",
              letterSpacing: "4px",
            }}
          />
          <button
            type="submit"
            disabled={otp.length !== 6 || loading} // Button only works when OTP is fully entered
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor:
                otp.length === 6 && !loading ? "#6a0572" : "#aaa", // Button grayed out when disabled
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: otp.length === 6 && !loading ? "pointer" : "not-allowed",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "transform 0.1s ease",
            }}
            onMouseOver={(e) =>
              otp.length === 6 &&
              !loading &&
              (e.target.style.backgroundColor = "#8a0a92")
            }
            onMouseOut={(e) =>
              otp.length === 6 &&
              !loading &&
              (e.target.style.backgroundColor = "#6a0572")
            }
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
