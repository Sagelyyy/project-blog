const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    avatar: { type: String },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("User", UserSchema);
