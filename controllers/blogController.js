const Blog = require("../models/Blog");

exports.blog_get = (req, res, next) => {
  Blog.find().exec(function (err, blogs) {
    if (err) {
      return next(err);
    }
    res.json(blogs);
  });
};

exports.blog_post = (req, res, next) => {
  if (req.user && req.user.admin) {
    const newBlog = new Blog({
      email: req.user.email,
      user: req.user.id,
      title: req.body.title,
      text: req.body.text,
      timestamp: Date.now(),
    }).save((err, blog) => {
      if (err) {
        return next(err);
      }
      res.json({
        message: "success",
        blog,
      });
    });
  } else {
    res.sendStatus(403);
  }
};
