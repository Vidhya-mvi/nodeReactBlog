import { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:5000/api/blogs?search=${searchTerm}`);
      setResults(data);
    } catch (err) {
      console.error("Error searching blogs:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul>
          {results.map((blog) => (
            <li key={blog._id}>{blog.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
