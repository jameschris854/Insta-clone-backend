const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type:  mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    postImage: {
      type: String,
      required: [true, "no post image"],
    },
    postCaption: {
      type: String,
      required: [true, "no caption"],
    },
    createdAt: {
      type: Date,
      default:Date.now
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Post = mongoose.model("Post", postSchema,'posts');

module.exports = Post;
