import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

 
  const isAdmin = user?.role?.toLowerCase() === "admin";


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin: "0", padding: "0" }}>
      
      <nav
        style={{
          width: "100%",
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
          height: "60px", 
        }}
      >
       
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          <Link
            to="/"
            style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
          >
             Blogify
          </Link>
        </div>

        <div>
          {user ? (
            <>
              <Link
                to="/myblogs"
                style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}
              >
                My Blogs
              </Link>
              <Link
                to="/create"
                style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}
              >
                Create Blog
              </Link>
              <Link
                to="/profile"
                style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  style={{ color: "#FFD700", textDecoration: "none", marginRight: "15px", fontWeight: "bold" }}
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}
              >
                Register
              </Link>
              <Link
                to="/login"
                style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}
              >
                Login
              </Link>
            </>
          )}
        </div>

      
        {user && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        )}
      </nav>

     
      <div
        style={{
          padding: "20px", 
          paddingTop: "80px",
          width: "100vw",
          minHeight: "100vh", 
          backgroundColor: "#f4f4f4",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
