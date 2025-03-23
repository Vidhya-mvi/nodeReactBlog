const Blog = require("../models/blog");


const createBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    console.log("Received data:", { title, content, file: req.file });

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newBlog = new Blog({
      title,
      content,
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


// 🔥 Get all blogs
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



// ✏️ Update a blog post (only author or admin)
const updateBlog = async (req, res) => {
  const { title, content, image } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the user is the author or an admin
    if (blog.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this blog" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update the blog" });
  }
};

// 🗑️ Delete a blog post (only author or admin)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the user is the author or an admin
    if (blog.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the blog" });
  }
};



// ❤️ Like a blog post
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user.id } }, // Add user ID if not already present
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to like the blog" });
  }
};

// 💔 Unlike a blog post
const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user.id } }, // Remove user ID if present
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to unlike the blog" });
  }
};

// 💬 Add a comment to a blog post
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

// ✂️ Delete a comment (only comment author or admin)
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const blog = await Blog.findById(req.params.id);

    const comment = blog.comments.id(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the user is the comment author or an admin
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
};
