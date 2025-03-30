const express = require("express");
const router = express.Router();
const {
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
  getAllUsers,
  searchBlogs
} = require("../controllers/blogController");

const { authMiddleware,isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/blogs", authMiddleware, upload.single("image"), createBlog);
router.get("/blogs", getBlogs);
router.get("/blogs/search", searchBlogs);
router.get("/blogs/:id", getBlogById);
router.put("/blogs/:id", upload.single("image"), updateBlog);
router.delete("/blogs/:id", authMiddleware, deleteBlog);
router.put("/blogs/like/:id", authMiddleware, likeBlog);
router.put("/blogs/unlike/:id", authMiddleware, unlikeBlog);
router.post("/blogs/comment/:id", authMiddleware, addComment);
router.delete("/blogs/comment/:id/:commentId", authMiddleware, deleteComment);

router.get("/blogs/user/:userId", authMiddleware, getUserBlogs);
router.get('/blogs/genre/:genre', getBlogsByGenre);

router.get("/users", authMiddleware, isAdmin, getAllUsers);

module.exports = router;
