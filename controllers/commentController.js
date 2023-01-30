const Comment = require("../models/Comment");

exports.comment_get = (req, res, next) => {
  Comment.find().exec((err, comments) => {
    if (err) return next(err);
    res.json({ comments });
  });
};

exports.blog_comment_get = (req, res, next) => {
  Comment.find({ $post: req.params.id }).exec(function (err, comments) {
    if (err) {
      return next(err);
    }
    res.json(comments);
  });
};

exports.blog_comment_post = (req, res, next) => {
  if (req.user) {
    const newComment = new Comment({
      post: req.params.id,
      user: req.user.id,
      text: req.body.text,
      public_username: "",
    }).save((err, comment) => {
      if (err) return next(err);
      res.json({ message: "success", comment });
    });
  } else {
    const newComment = new Comment({
      post: req.params.id,
      public_username: req.body.anonymous,
      text: req.body.text,
    }).save((err, comment) => {
      if (err) return next(err);
      res.json({ message: "success", comment });
    });
  }
};

exports.comment_detail = (req, res, next) => {
  Comment.findById(req.params.id).exec(function (err, comment) {
    if (err) return next(err);
    res.json({ comment });
  });
};

exports.comment_update_put = (req, res, next) => {
  if (req.user && req.user.admin) {
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
};

exports.comment_delete = (req, res, next) => {
  if (req.user && req.user.admin) {
    Comment.findByIdAndDelete(req.params.id).exec(function (err, result) {
      if (err) return next(err);
      res.json({ message: `Deleted comment ${req.params.id}` });
    });
  } else {
    res.sendStatus(403);
  }
};
