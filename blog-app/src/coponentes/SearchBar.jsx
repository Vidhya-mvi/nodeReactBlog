import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();


  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:5000/api/blogs?search=${term}`);
      setResults(data);
    } catch (err) {
      console.error("Error searching blogs:", err);
    }
  };


  const handleResultClick = (blogId) => {
    setSearchTerm("");
    setResults([]);
    navigate(`/blogs/${blogId}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="🔍 Search blogs..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          padding: "5px",
          borderRadius: "5px",
          border: "none",
          fontSize: "1rem",
          width: "200px",
        }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#fff",
            listStyle: "none",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            zIndex: 20,
            width: "100%",
            borderRadius: "5px",
          }}
        >
          {results.map((blog) => (
            <li
              key={blog._id}
              onClick={() => handleResultClick(blog._id)}
              style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #ddd" }}
            >
              {blog.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
