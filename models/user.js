const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  user_name: { type: String, required: true, maxLength: 20 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ["User", "Member", "Admin"],
    default: "User",
  },
});

module.exports = mongoose.model("User", UserSchema);
