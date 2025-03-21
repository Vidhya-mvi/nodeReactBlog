import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../coponentes/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]); 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/blogs");
        console.log("Fetched data:", data); 
        setBlogs(data);
      } catch (err) {
        console.error("Failed to load blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#f5f5f5", 
      padding: "20px" 
    }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>All Blogs</h2>
      <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "15px" }}>
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Home;
