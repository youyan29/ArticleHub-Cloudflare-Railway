const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema({
  chapterId: mongoose.Schema.Types.ObjectId,
  content: String,
  message: String,
  time: Date,
  isRestore:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("Version", VersionSchema);