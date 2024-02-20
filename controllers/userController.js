const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

exports.homepage = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const allMessages = await Message.find()
      .sort({ time_stamp: 1 })
      .populate("created_by")
      .exec();
    res.render("homepage", { messages: allMessages });
  } else {
    res.render("homepage");
  }
});

exports.log_out = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.upgrade_status_get = (req, res, next) => {
  res.render("upgrade");
};

exports.upgrade_status_post = [
  // Validate and sanitize the password field.
  body("password")
    .trim()
    .custom((value) => {
      if (
        value === process.env.ADMIN_PASSWORD ||
        value === process.env.MEMBER_PASSWORD
      ) {
        return true;
      } else {
        throw new Error("Password invalid");
      }
    })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const status =
      req.body.password === process.env.ADMIN_PASSWORD
        ? "Admin"
        : req.body.password === process.env.MEMBER_PASSWORD
        ? "Member"
        : "User";

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("upgrade", {
        errors: errors.array(),
      });

      return;
    } else {
      // Data from form is valid.
      // Update the record.
      await User.findByIdAndUpdate(
        req.user.id,
        { membership_status: status },
        {}
      );

      res.redirect("/");
    }
  }),
];
exports.log_in_get = (req, res, next) => {
  res.render("log-in", { title: "Please log-in" });
};

exports.log_in_post = [
  // Validate and sanitize the password field.
  body("username", "User name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password is missing").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("log-in", {
        title: "Please log-in",
        errors: errors.array(),
      });

      return;
    } else {
      passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
        failureMessage: true,
      })(req, res, next);
    }
  },
];

exports.sign_up_post = [
  // Validate and sanitize the password field.
  body("first_name", "First name must be specified and < 100 characters")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("last_name", "Last name must be specified and < 100 characters")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("user_name", "User name must be specified and < 20 characters")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("email", "Email must be specified and in valid format")
    .trim()
    .isEmail()
    .escape(),
  body("password", "Password is missing")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => {
      if (value !== req.body.password_confirm) {
        throw new Error("Password confirmation is invalid");
      }

      return true;
    })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("homepage", {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        email: req.body.email,
        errors: errors.array(),
      });

      return;
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const newUser = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_name: req.body.user_name,
          email: req.body.email,
          password: hashedPassword,
          membership_status: "User",
        });
        await newUser.save();
      });

      res.render("log-in", { title: "Registration confirmed, plz log in" });
    }
  }),
];
