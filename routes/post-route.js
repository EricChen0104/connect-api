const router = require("express").Router();
const Post = require("../models").post;
const Comment = require("../models").comments;
const LikePost = require("../models").postLike;
const postValidation = require("../validation").postValidation;

router.use((req, res, next) => {
  console.log("post-route is receiving a request...");
  next();
});

router.get("/", async (req, res) => {
  try {
    let postFound = await Post.find({}).populate("writer", ["username"]).exec();
    return res.send(postFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/profile/:_writer_id", async (req, res) => {
  let { _writer_id } = req.params;
  let postFound = await Post.find({ writer: _writer_id })
    .populate("writer", ["username"])
    .exec();

  return res.send(postFound);
});

router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let postFound = await Post.findOne({ _id })
      .populate("writer", ["username"])
      .exec();

    return res.send(postFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.post("/", async (req, res) => {
  let { error } = postValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let { title, description } = req.body;

  try {
    let newPost = new Post({
      title,
      description,
      writer: req.user._id,
    });
    let savedPost = await newPost.save();
    return res.send({
      msg: "new post has been saved",
      savedPost,
    });
  } catch (e) {
    return res.status(500).send("can't creat a post");
  }
});

router.patch("/:_id", async (req, res) => {
  let { error } = postValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let { _id } = req.params;
  try {
    let postFound = await Post.findOne({ _id });
    if (!postFound) {
      return res.status(400).send("Can't find post. Can't edit the post");
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  let updatedPost = await Post.findOneAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true,
  });
  return res.send({
    message: "Post has been updated successfully!",
    updatedPost,
  });
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let postFound = await Post.findOne({ _id });
    if (!postFound) {
      return res.status(400).send("Can't find post. Can't delete the post");
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  await Post.deleteOne({ _id });
  return res.send("Post has been deleted successfully!");
});

router.post("/like", async (req, res) => {
  try {
    const { userId, postId } = req.body;
    console.log(userId, postId);

    const post = await Post.findById(postId);
    console.log(post);
    if (!post) {
      return res.status(404).send("Post not found.");
    }
    // if (post.likes.includes(userId)) {
    //   return res.status(400).send("You have already liked the post");
    // }
    const alreadyLikedIndex = post.likesUser.indexOf(userId);
    console.log(alreadyLikedIndex);
    if (alreadyLikedIndex !== -1) {
      // If user has already liked, remove the like
      post.likesUser.splice(alreadyLikedIndex, 1);
      post.likes -= 1;
      await post.save();
      return res.status(200).send({ msg: "Post unliked successfully.", post });
    }
    post.likesUser.push(userId);
    post.likes += 1;
    await post.save();

    return res.status(200).send({ msg: "Post liked successfully!", post });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post("/comment", async (req, res) => {
  const { commentText, postId } = req.body;
  const post = await Post.findById(postId);
  console.log(post);
  if (!post) {
    return res.status(404).send("Post not found.");
  }
  try {
    let newComment = new Comment({
      postId,
      userId: req.user._id,
      commentText,
    });
    let savedComment = await newComment.save();
    return res.send({
      msg: "new post has been saved",
      savedComment,
    });
  } catch (e) {
    return res.status(500).send("can't creat a comment");
  }
});

router.post("/comment/like", async (req, res) => {
  try {
    const { userId, commentId } = req.body;
    console.log(userId, commentId);

    const post = await Comment.findById(commentId);
    console.log(post);
    if (!post) {
      return res.status(404).send("Comment not found.");
    }
    const alreadyLikedIndex = post.likesUser.indexOf(userId);
    console.log(alreadyLikedIndex);
    if (alreadyLikedIndex !== -1) {
      // If user has already liked, remove the like
      post.likesUser.splice(alreadyLikedIndex, 1);
      post.likes -= 1;
      await post.save();
      return res
        .status(200)
        .send({ msg: "Comment unliked successfully.", post });
    }
    post.likesUser.push(userId);
    post.likes += 1;
    await post.save();

    return res.status(200).send({ msg: "Comment liked successfully!", post });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
