const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
// GET home page.
router.get("/", user_controller.homepage);
// Log out from homepage
router.get("/log-out", loggedIn, user_controller.log_out);
// upgrade status get form
router.get("/upgrade-status", loggedIn, user_controller.upgrade_status_get);
// upgrade status post form
router.post("/upgrade-status", loggedIn, user_controller.upgrade_status_post);
// Log in get from homepage
router.get("/log-in", user_controller.log_in_get);
// Log in post from homepage
router.post("/log-in", user_controller.log_in_post);
//Sign up post from homepage
router.post("/sign-up", user_controller.sign_up_post);
//Create new message get request
router.get("/create-message", loggedIn, message_controller.create_message_get);
//Create new message post request
router.post(
  "/create-message",
  loggedIn,
  message_controller.create_message_post
);
//Delete message get request
router.get(
  "/message/:id/delete",
  loggedIn,
  message_controller.delete_message_get
);
//Delete message post request
router.post(
  "/message/:id/delete",
  loggedIn,
  message_controller.delete_message_post
);

module.exports = router;
