const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");

exports.auth_login_get = (req, res, next) => {
  if (req.user && req.user.admin) {
    User.find()
      .select("user.username user.email user.admin")
      .exec((err, users) => {
        if (err) return next(err);
        res.json({ users });
      });
  } else {
    res.sendStatus(403);
  }
};

exports.auth_login_post = (req, res, next) => {
  User.findOne({ email: req.body.email }).exec(function (err, user) {
    if (err) {
      throw new Error(err);
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }
      if (result) {
        let maxAge = 3 * 24 * 60 * 60
        jwt.sign(
          {
            email: user.email,
            admin: user.admin,
            id: user._id,
          },
          process.env.ACCESS_TOKEN_SECRET,{
          expiresIn: maxAge * 1000},
          (err, token) => {
            if(err) return next(err)
            res.cookie("authorization", "Bearer " + token, {
              httpOnly: true,
              maxAge: maxAge * 1000
            });
            res.json({ message: "success", user });
          }
        );
      } else {
        return res.json({
          success: false,
          message: "passwords do not match",
        });
      }
    });
  });
};

exports.get_auth_status = (req, res, next) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.sendStatus(403);
  }
};
