const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    title: { type: String },
    body: { type: String },
    userId: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const RecordModel = mongoose.model("blogs", recordSchema);

module.exports = { RecordModel };
