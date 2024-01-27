const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const BlogModel = mongoose.model("blogs", blogSchema);

module.exports = { BlogModel };
