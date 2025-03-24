import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState("");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/current-user", { withCredentials: true });
        setUser(res.data.user);
        setNewBio(res.data.user.bio || ""); // Set bio if available
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle bio update
  const handleSaveBio = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/update-bio`,
        { bio: newBio },
        { withCredentials: true }
      );

      setUser((prevUser) => ({ ...prevUser, bio: res.data.user.bio }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update bio:", err);
      setError("Failed to update bio. Please try again.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div className="spinner"></div>
        <p style={{ color: "black" }}>Loading profile...</p>
      </div>
    );

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", color: "black", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "black", textAlign: "center" }}>My Profile</h1>

      {user && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={user.profilePicture || "/default-profile.png"}
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "20px" }}
          />

          <p>
            <strong style={{ color: "black" }}>Username:</strong> {user.username}
          </p>
          <p>
            <strong style={{ color: "black" }}>Email:</strong> {user.email}
          </p>
          <p>
            <strong style={{ color: "black" }}>Role:</strong> {user.role}
          </p>

          {/* Bio Section */}
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <strong style={{ color: "black" }}>Bio:</strong>
            {isEditing ? (
              <>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  style={{
                    width: "100%",
                    height: "80px",
                    marginTop: "5px",
                    padding: "5px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
                <div style={{ marginTop: "10px" }}>
                  <button
                    style={{ backgroundColor: "#4CAF50", color: "white", padding: "0.5rem 1rem", borderRadius: "6px" }}
                    onClick={handleSaveBio}
                  >
                    Save
                  </button>
                  <button
                    style={{ marginLeft: "10px", backgroundColor: "#EF4444", color: "white", padding: "0.5rem 1rem", borderRadius: "6px" }}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: "#555" }}>
                {user.bio || "No bio yet... Add something about yourself!"}
              </p>
            )}

            {!isEditing && (
              <button
                style={{
                  marginTop: "10px",
                  backgroundColor: "#3B82F6",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit Bio
              </button>
            )}
          </div>

          {/* Logout Button */}
          <button
            style={{
              marginTop: "10px",
              backgroundColor: "#EF4444",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
