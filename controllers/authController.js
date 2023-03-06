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

exports.auth_login_post = [
  body("email", "Invalid email address").trim().escape().isLength({ min: 1 }),
  body("password", "Invalid password").trim().escape().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    let messages = validationResult(req).array();
    if (!errors.isEmpty()) {
      res.status(400).json({ message: messages });
      return;
    }
    User.findOne({ email: req.body.email }).exec(function (err, user) {
      if (err) {
        throw new Error(err);
      }
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return next(err);
          }
          if (result) {
            jwt.sign(
              {
                email: user.email,
                admin: user.admin,
                username: user.username,
                id: user._id,
              },
              process.env.ACCESS_TOKEN_SECRET,
              (err, token) => {
                const oneMonth = 30 * 24 * 60 * 60 * 1000; // One month in milliseconds
                const expires = new Date(Date.now() + oneMonth); // Current time + one month
                if (err) console.log(err);
                res.cookie("authorization", "Bearer " + token, {
                  httpOnly: false,
                  maxAge: expires,
                  expires: expires,
                  sameSite: "none",
                  secure: true,
                });
                res.json({ message: "success", user });
              }
            );
          } else {
            messages = [{ msg: "Invalid password" }];
            return res.status(400).json({
              message: messages,
            });
          }
        });
      } else {
        messages = [{ msg: "Invalid email" }];
        return res.status(400).json({
          message: messages,
        });
      }
    });
  },
];

exports.get_auth_status = (req, res, next) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.sendStatus(403);
  }
};
