const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.auth_login_get = (req, res, next) => {
  res.json({ message: "TODO Login Get" });
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
        // JWT
        jwt.sign(
          {
            email: user.email,
            admin: user.admin,
            id: user._id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          (err, token) => {
            res.json({
              token,
            });
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
