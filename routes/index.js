const express = require("express");
const authenticateToken = require("../utils/authenticate");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    message: "Hello world",
  });
});

// Auth Routes

router.post("/login", authController.auth_login_post);

// blog Routes

router.use("/blogs", authenticateToken);

router.get("/blogs", blogController.blog_get);
router.post("/blogs", blogController.blog_post);

// Comment Routes

module.exports = router;
