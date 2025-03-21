import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      {blog.image?.url && <img src={blog.image.url} alt={blog.title} />}
      <h3>{blog.title}</h3>
      <p>{blog.content.substring(0, 100)}...</p>
      <Link to={`/blog/${blog._id}`}>Read More</Link>
    </div>
  );
};

export default BlogCard;
