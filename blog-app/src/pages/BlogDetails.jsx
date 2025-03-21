import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(data);
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to like this blog!");
    await axios.put(`http://localhost:5000/api/blogs/like/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    window.location.reload();
  };

  return (
    <div>
      {blog && (
        <>
          {blog.image?.url && <img src={blog.image.url} alt={blog.title} />}
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          <button onClick={handleLike}>👍 Like ({blog.likes.length})</button>
        </>
      )}
    </div>
  );
};

export default BlogDetails;
