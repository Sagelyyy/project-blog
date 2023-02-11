const express = require("express");
const authenticateToken = require("../utils/authenticate");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const router = express.Router();

// Middleware to check JWT auth token
router.use("/", authenticateToken);

router.get("/", (req, res, next) => {
  res.json({
    message: "Hello world",
  });
});

// Auth Routes
router.get("/users", authController.auth_login_get);
router.post("/users", authController.auth_login_post);
router.get("/users/me", authController.get_auth_status);

// Blog Routes
router.get("/blogs", blogController.blog_get);
router.post("/blogs", blogController.blog_post);
router.get("/blogs/:id", blogController.blog_detail);
router.put("/blogs/:id", blogController.blog_update_put);
router.delete("/blogs/:id", blogController.blog_delete);

// Comment Routes
router.get("/comments", commentController.comment_get);
router.get("/blogs/:id/comments", commentController.blog_comment_get);
router.post("/blogs/:id/comments", commentController.blog_comment_post);
router.get("/comments/:id/", commentController.comment_detail);
router.put("/comments/:id/", commentController.comment_update_put);
router.delete("/comments/:id/", commentController.comment_delete);

module.exports = router;
