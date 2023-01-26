const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const BlogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, minLength: 1, maxLength: 50 },
  text: { type: String, required: true, minLength: 1, maxLength: 500 },
  timestamp: { type: Date, default: Date.now, required: true },
});

BlogSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("MM-dd-yyyy, HH:mm");
});

BlogSchema.virtual("url").get(function () {
  return `/Blogs/${this._id}`;
});

module.exports = mongoose.model("Blog", BlogSchema);
