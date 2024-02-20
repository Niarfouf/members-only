const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now },
  text: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User" },
});

MessageSchema.virtual("time_stamp_formatted").get(function () {
  return DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
