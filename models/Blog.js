const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const BlogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    text: { type: String, required: true, minLength: 1, maxLength: 500 },
    number: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    comments: { type: [mongoose.Schema.ObjectId], ref: "Comments" },
    status: {type: String, enum:['published', 'unpublished'], required: true}
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BlogSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("MM-dd-yyyy, HH:mm");
});

BlogSchema.virtual("url").get(function () {
  return `/blogs/${this._id}`;
});

module.exports = mongoose.model("Blog", BlogSchema);
