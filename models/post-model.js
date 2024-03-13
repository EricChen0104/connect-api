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

const postSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: timeStamp,
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  isLiked: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Post", postSchema);
