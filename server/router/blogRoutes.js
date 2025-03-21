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
} = require("../controllers/blogController");

const upload = require("../middleware/upload");

// Add multer upload middleware to the create route
router.post("/blogs", upload.single("image"), createBlog);

router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlogById);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

router.put("/blogs/like/:id", likeBlog);
router.put("/blogs/unlike/:id", unlikeBlog);

router.post("/blogs/comment/:id", addComment);
router.delete("/blogs/comment/:id/:commentId", deleteComment);

module.exports = router;
