import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f4f4f4",
        boxSizing: "border-box",
        overflowX: "hidden", // Ensures no horizontal scrollbars
      }}
    >
      <h2
        style={{
          color: "#333",
          borderBottom: "2px solid #4caf50",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        Admin Dashboard
      </h2>

      <ul
        style={{
          listStyleType: "none",
          padding: "0",
          margin: "0 auto",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {users.length > 0 ? (
          users.map((user, index) => (
            <li
              key={user._id}
              style={{
                padding: "10px 15px",
                borderBottom: "1px solid #ddd",
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                marginBottom: "5px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#333" }}>
                {user.username}
              </span>
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "15px",
                  backgroundColor: user.role === "admin" ? "#f44336" : "#4caf50",
                  color: "#fff",
                  fontSize: "0.9rem",
                }}
              >
                {user.role}
              </span>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#555" }}>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
