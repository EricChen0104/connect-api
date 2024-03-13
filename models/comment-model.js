const mongoose = require("mongoose");
const { Schema } = mongoose;

var current = new Date();
const timeStamp = new Date(
  Date.UTC(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    current.getHours(),
    current.getMinutes(),
    current.getSeconds(),
    current.getMilliseconds()
  )
);

const commentSchema = new Schema({
  id: {
    type: String,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commentText: {
    type: String,
  },
  likesUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LikeUser",
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: timeStamp,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
