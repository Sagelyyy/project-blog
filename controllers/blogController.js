const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

exports.blog_get = (req, res, next) => {
  Blog.find()
    .populate("user", "username avatar")
    .exec(function (err, blogs) {
      if (err) {
        return next(err);
      }
      res.json({ blogs });
    });
};

exports.blog_post = (req, res, next) => {
  // TODO add validation!
  if (req.user && req.user.admin) {
    const newBlog = new Blog({
      email: req.user.email,
      user: req.user.id,
      title: req.body.title,
      text: req.body.text,
      number: req.body.number,
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
};

exports.blog_detail = (req, res, next) => {
  Blog.findById(req.params.id).exec(function (err, blog) {
    if (err) return next(err);
    res.json({
      blog,
    });
  });
};

exports.blog_update_put = (req, res, next) => {
  // TODO add validation!
  if (req.user && req.user.admin) {
    const newBlog = new Blog({
      user: req.user.username,
      title: req.body.title,
      text: req.body.text,
      _id: req.params.id,
    });

    Blog.findByIdAndUpdate(req.params.id, newBlog).exec(function (err, result) {
      if (err) return next(err);
      res.json({ newBlog });
    });
  } else {
    res.sendStatus(403);
  }
};

exports.blog_delete = (req, res, next) => {
  // TODO add validation!
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
