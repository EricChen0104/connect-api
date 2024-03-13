const router = require("express").Router();
const Post = require("../models").post;
const Comment = require("../models").comments;
const postValidation = require("../validation").postValidation;

router.use((req, res, next) => {
  console.log("post-route is receiving a request...");
  next();
});
router.get("/profile/:_writer_id", async (req, res) => {
  let { _writer_id } = req.params;
  let postFound = await Post.find({ writer: _writer_id })
    .populate("writer", ["username"])
    .exec();

  return res.send(postFound);
});
router.get("/", async (req, res) => {
  try {
    let postFound = await Post.find({}).populate("writer", ["username"]).exec();
    return res.send(postFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});
router.get("/comment/:postId", async (req, res) => {
  let { postId } = req.params;
  try {
    let postFound = await Comment.find({ postId })
      .populate("userId", ["username"])
      .exec();
    return res.send(postFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
