import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        style={{
          padding: "10px",
          backgroundColor: "#ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {/* Home is always visible */}
          <Link to="/" style={{ marginRight: "15px" }}>
            Home
          </Link>

          {/* Show different links based on login status */}
          {user ? (
            <>
              <Link to="/myblogs" style={{ marginRight: "15px" }}>
                My Blogs
              </Link>
              <Link to="/create" style={{ marginRight: "15px" }}>
                Create Blog
              </Link>
              <Link to="/profile" style={{ marginRight: "15px" }}>
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" style={{ marginRight: "15px" }}>
                Register
              </Link>
              <Link to="/login" style={{ marginRight: "15px" }}>
                Login
              </Link>
            </>
          )}
        </div>

        {/* Logout button only for logged-in users */}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "red",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Logout
          </button>
        )}
      </nav>

      {/* Page content */}
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
};

export default Layout;
