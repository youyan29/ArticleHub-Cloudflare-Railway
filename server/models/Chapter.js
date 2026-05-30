const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  articleId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  order: Number
});

module.exports = mongoose.model("Chapter", ChapterSchema);