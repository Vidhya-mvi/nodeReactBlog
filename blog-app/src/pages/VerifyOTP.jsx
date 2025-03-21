import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Import useNavigate and useLocation

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();  // Access location to get userId
  const navigate = useNavigate();  // Use navigate for redirection
  const { userId } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage("OTP must be 6 digits.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });
      const result = await response.json();
      if (response.status === 200) {
        setMessage(result.message);
        navigate("/login");  // Use navigate instead of history.push
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setMessage("Verification failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
