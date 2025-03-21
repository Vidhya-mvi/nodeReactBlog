import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./coponentes/Layout";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import CreateBlog from "./pages/CreatBlog";
import MyBlogs from "./pages/MyBlogs"
import BlogDetails from "./pages/BlogDetails";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import VerifyOTP from "./pages/VerifyOtp";

function App() {
  const [user, setUser] = useState(null);

  // Check token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setUser(null);
      }
    }
  }, []);

  return (
    <Router>
    <Routes>
      {/* Routes with Navbar */}
      <Route path="/" element={<Layout user={user} setUser={setUser} />}>
        <Route index element={<Home />} />
        <Route path="/create-blog" element={user ? <CreateBlog /> : <Login setUser={setUser} />} />
        <Route path="/my-blogs" element={user ? <MyBlogs /> : <Login setUser={setUser} />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        {user?.role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}
      </Route>
  
      {/* Routes without Navbar */}
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
  
  );
}


export default App;
