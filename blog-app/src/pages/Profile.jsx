import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/current-user", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h1 style={{ color: "black" }}>My Profile</h1>
      {user ? (
        <div>
          <p>
            <strong style={{ color: "black" }}>Username:</strong> {user.username}
          </p>
          <p>
            <strong style={{ color: "black" }}>Email:</strong> {user.email}
          </p>
          <p>
            <strong style={{ color: "black" }}>Role:</strong> {user.role}
          </p>
        </div>
      ) : (
        <p style={{ color: "black" }}>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
