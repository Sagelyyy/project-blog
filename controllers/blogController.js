const { body, validationResult } = require("express-validator");
const Blog = require("../models/Blog");

exports.blog_get = (req, res, next) => {
  const referrer = req.headers.referer;
  if (referrer && referrer.includes("https://chriscancode.up.railway.app/")) {
    Blog.find({ status: "published" })
      .populate("user", "username avatar")
      .sort({ timestamp: "descending" })
      .exec(function (err, blogs) {
        if (err) {
          return next(err);
        }
        res.json({ blogs });
      });
  } else {
    Blog.find()
      .populate("user", "username avatar")
      .sort({ timestamp: "descending" })
      .exec(function (err, blogs) {
        if (err) {
          return next(err);
        }
        res.json({ blogs });
      });
  }
};

exports.blog_post = [
  body("title", "Invalid Title").not().isEmpty().trim().escape(),
  body("text", "Invalid Post").not().isEmpty().trim(),
  body("number", "Invalid roll").not().isEmpty().trim().escape(),
  (req, res, next) => {
    if (req.user && req.user.admin) {
      const errors = validationResult(req);
      let messages = validationResult(req).array();
      if (!errors.isEmpty()) {
        res.status(400).json({ message: messages });
        return;
      }
      const newBlog = new Blog({
        email: req.user.email,
        user: req.user.id,
        title: req.body.title,
        text: req.body.text,
        number: req.body.number,
        status: req.body.status,
        timestamp: Date.now(),
      }).save((err, blog) => {
        if (err) {
          return next(err);
        }
        res.json({
          current_user: req.user.email,
          message: "success",
          blog,
        });
      });
    } else {
      res.sendStatus(403);
    }
  },
];

exports.blog_detail = (req, res, next) => {
  Blog.findById(req.params.id)
    .populate("user", "username avatar")
    .exec(function (err, blog) {
      if (err) return next(err);
      res.json({
        blog,
      });
    });
};

exports.blog_update_put = [
  body("title", "Invalid Title").not().isEmpty().trim().escape(),
  body("text", "Post").not().isEmpty().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    let messages = validationResult(req).array();
    if (!errors.isEmpty()) {
      res.status(400).json({ message: messages });
      return;
    }
    if (req.user && req.user.admin) {
      const newBlog = new Blog({
        user: req.user.username,
        title: req.body.title,
        text: req.body.text,
        status: req.body.status,
        _id: req.params.id,
      });

      Blog.findByIdAndUpdate(req.params.id, newBlog).exec(function (
        err,
        result
      ) {
        if (err) return next(err);
        res.json({ newBlog });
      });
    } else {
      res.sendStatus(403);
    }
  },
];

exports.blog_delete = (req, res, next) => {
  if (req.user && req.user.admin) {
    Blog.findByIdAndDelete(req.params.id).exec(function (err, result) {
      if (err) return next(err);
      res.json({
        message: `Deleted post ${req.params.id}`,
      });
    });
  } else {
    res.sendStatus(403);
  }
};
