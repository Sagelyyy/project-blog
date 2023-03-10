const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const { body, validationResult } = require("express-validator");

exports.comment_get = (req, res, next) => {
  Comment.find().exec((err, comments) => {
    if (err) return next(err);
    res.json({ comments });
  });
};

exports.blog_comment_get = (req, res, next) => {
  Blog.findById(req.params.id)
    .populate({ path: "comments", populate: { path: "user", model: "User" } })
    .exec(function (err, result) {
      if (err) return next(err);
      res.json({ result });
    });
};

exports.blog_comment_post = [
  body("text", "Invalid post").not().isEmpty().trim().escape(),
(req, res, next) => {
  const errors = validationResult(req)
  let messages = validationResult(req).array()
  if(!errors.isEmpty()){
    res.status(400).json(
      {message: messages}
    )
    return
  }
  const newComment = new Comment({
    post: req.params.id,
    user: req.user ? req.user.id : null,
    text: req.body.text,
    public_username: req.body.public_username,
  }).save((err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: comment._id },
      },
      function (err, result) {
        if (err) return next(err);
        res.json({ result });
      }
    );
  });
}
]

exports.comment_detail = (req, res, next) => {
  Comment.findById(req.params.id).exec(function (err, comment) {
    if (err) return next(err);
    res.json({ comment });
  });
};

exports.comment_update_put = [
  body("text", "Invalid post").not().isEmpty().trim().escape(),
(req, res, next) => {
  if (req.user && req.user.admin) {
    const errors = validationResult(req)
    let messages = validationResult(req).array()
    if(!errors.isEmpty()){
      res.status(400).json(
        {message: messages}
      )
      return
    }
    Comment.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          text: req.body.text,
          _id: req.params.id,
        },
      },
      { returnDocument: "after" },
      (err, result) => {
        if (err) return next(err);
        res.json({ result });
      }
    );
  } else {
    res.sendStatus(403);
  }
}
]

exports.comment_delete = (req, res, next) => {
  if (req.user && req.user.admin) {
    Comment.findByIdAndDelete(req.params.id).exec(function (err, result) {
      if (err) return next(err);
      Blog.updateOne(
        { _id: req.body.blog },
        { $pull: { comments: req.params.id } }
      ).exec(function (err, doc) {
        if (err) return next(err);
        res.json({ doc });
      });
    });
  } else {
    res.sendStatus(403);
  }
};
