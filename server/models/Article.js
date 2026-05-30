const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,

    cover: {
      type: {
        type: String,
        default: "emoji",
      },
      value: {
        type: String,
        default: "📘",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Article", ArticleSchema);
