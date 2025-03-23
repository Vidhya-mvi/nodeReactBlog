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
const {authMiddleware,isAdmin } = require("../middleware/authMiddleware")
const upload = require("../middleware/upload");

router.get("/blogs", getBlogs);  

router.post("/blogs", authMiddleware, upload.single("image"), createBlog);
router.get("/blogs/:id",  getBlogById);

router.put("/blogs/:id",authMiddleware, updateBlog);
router.delete("/blogs/:id",authMiddleware, deleteBlog);

router.put("/blogs/like/:id",authMiddleware, likeBlog);
router.put("/blogs/unlike/:id",authMiddleware, unlikeBlog);

router.post("/blogs/comment/:id",authMiddleware, addComment);
router.delete("/blogs/comment/:id/:commentId",authMiddleware, deleteComment);

module.exports = router;
