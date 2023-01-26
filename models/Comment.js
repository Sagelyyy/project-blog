const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: false, default: "Anonymous" },
  text: { type: String, required: true, minLength: 1, maxLength: 500 },
  timestamp: { type: Date, default: Date.now, required: true },
});

CommentSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("MM-dd-yyyy, HH:mm");
});

CommentSchema.virtual("url").get(function () {
  return `/comments/${this._id}`;
});

module.exports = mongoose.model("Post", CommentSchema);
