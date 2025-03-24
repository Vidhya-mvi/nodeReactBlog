const Blog = require("../models/blog");
const User = require("../models/user")

//  Create a new blog with genre
const createBlog = async (req, res) => {
  const { title, content, genre } = req.body;

  try {
    console.log("Received data:", { title, content, genre, file: req.file });

    if (!title || !content || !genre) {
      return res.status(400).json({ error: "Title, content, and genre are required" });
    }

    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    const newBlog = new Blog({
      title,
      content,
      genre,
      image,
      postedBy: req.user.id,
    });

    const savedBlog = await newBlog.save();
    console.log("Blog saved successfully:", savedBlog);

    res.status(201).json(savedBlog);
  } catch (err) {
    console.error("Error saving blog:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

//  Get all blogs 
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("postedBy", "username")
      .populate("comments.postedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

const getBlogsByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const blogs = await Blog.find({ genre: { $regex: new RegExp(`^${genre}$`, "i") } });

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found for this genre" });
    }

    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by genre:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//  Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("postedBy", "username")
      .populate("comments.postedBy", "username");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (err) {
    console.error("Failed to fetch the blog:", err.message);
    res.status(500).json({ error: "Failed to fetch the blog" });
  }
};


const getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Backend received userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const blogs = await Blog.find({ postedBy: userId })
      .populate("postedBy", "username email");

    if (!blogs.length) return res.status(404).json({ message: "No blogs found for this user" });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Update blog
const updateBlog = async (req, res) => {
  try {
    const { title, content, genre } = req.body;
    const updatedData = { title, content, genre };

    if (req.file) {
      updatedData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

    res.json(updatedBlog);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

//  Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the blog" });
  }
};

//  Like a blog post
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to like the blog" });
  }
};

//  Unlike a blog post
const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to unlike the blog" });
  }
};

//  Add a comment
const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text, postedBy: req.user.id } } },
      { new: true }
    )
      .populate("comments.postedBy", "username")
      .populate("postedBy", "username");

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

//  Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const blog = await Blog.findById(req.params.id);

    const comment = blog.comments.id(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.deleteOne();
    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude passwords for safety
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addComment,
  deleteComment,
  getUserBlogs,
  getBlogsByGenre, 
  getAllUsers
};
