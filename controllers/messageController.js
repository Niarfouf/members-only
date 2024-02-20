const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
exports.create_message_get = (req, res, next) => {
  res.render("create_message");
};

exports.create_message_post = [
  // Validate and sanitize fields.
  body("title", "Message's title must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Message's text must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a message object with escaped and trimmed data.
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      created_by: req.user.id,
    });

    if (!errors.isEmpty()) {
      res.render("create_message", {
        title: "Create Message",
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      await message.save();
      res.redirect("/");
    }
  }),
];

exports.delete_message_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id)
    .populate("created_by")
    .exec();

  if (message === null || req.user.membership_status !== "Admin") {
    res.redirect("/");
  }

  res.render("delete_message", {
    message: message,
  });
});

exports.delete_message_post = asyncHandler(async (req, res, next) => {
  if (req.user.membership_status !== "Admin") {
    res.redirect("/");
  }
  await Message.findByIdAndDelete(req.params.id).exec();
  res.redirect("/");
});
