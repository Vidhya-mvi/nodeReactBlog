const jwt = require("jsonwebtoken");

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    // If no token, return unauthorized
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;

    console.log("✅ Authenticated User:", req.user);

    next();
  } catch (err) {
    console.error("⛔ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin Authorization Middleware
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  console.log("✅ Admin access granted");
  next();
};

module.exports = { authMiddleware, isAdmin };
