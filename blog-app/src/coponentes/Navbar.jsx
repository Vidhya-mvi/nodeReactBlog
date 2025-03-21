import { Link, NavLink } from "react-router-dom";
import { useEffect } from "react";

const Navbar = ({ user, setUser }) => {
  // Fetch the current user session or check the user after logout
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null); // Ensure the user is logged out in case of error
      }
    };

    checkSession();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null); // Reset user state on logout
      } else {
        console.error("Logout failed.");
        alert("Failed to log out, please try again.");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("An error occurred while logging out.");
    }
  };

  const navbarStyles = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    width: "100%",
    boxSizing: "border-box",
  };

  const linkStyles = {
    color: "#4caf50",
    textDecoration: "none",
  };

  const activeLinkStyles = {
    color: "#f44336",
  };

  return (
    <nav style={navbarStyles}>
      {/* Blog App title now links to home */}
      <Link
        to="/"
        style={{
          margin: "0",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        Blog App
      </Link>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap", // Wrap items if space is tight
        }}
      >
        {user ? (
          <>
            <span style={{ fontWeight: "500", color: "#ddd" }}>
              Welcome, {user.username}
            </span>
            <NavLink
              to="/create-blog"
              style={({ isActive }) => ({
                ...linkStyles,
                ...(isActive ? activeLinkStyles : {}),
              })}
            >
              Create Blog
            </NavLink>
            <NavLink
              to="/my-blogs"
              style={({ isActive }) => ({
                ...linkStyles,
                ...(isActive ? activeLinkStyles : {}),
              })}
            >
              My Blogs
            </NavLink>
            {user.role === "admin" && (
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  ...linkStyles,
                  color: isActive ? "#ff9800" : "#fff", // Specific color for admin
                })}
              >
                Admin Dashboard
              </NavLink>
            )}
            <Link
              to="/"
              onClick={handleLogout}
              style={{ ...linkStyles, color: "#f44336" }}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                ...linkStyles,
                ...(isActive ? activeLinkStyles : {}),
              })}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              style={({ isActive }) => ({
                ...linkStyles,
                ...(isActive ? activeLinkStyles : {}),
              })}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
