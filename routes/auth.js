const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功成功連結auth route...");
});

router.post("/register", async (req, res) => {
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("this email was already registered");

  let { email, username, password } = req.body;
  let newUser = new User({ email, username, password });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "successfully saved user",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("can't saved user");
  }
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser)
    return res
      .status(401)
      .send(
        "Can't find user. Please confirm whether the email address is correct"
      );
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "login success",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("incorrect password");
    }
  });
});

router.patch("/:_id", async (req, res) => {
  let { _id } = req.params;
  console.log(req.body);
  try {
    let userFound = await User.findOne({ username: req.body.username });
    let nowuserFound = await User.findOne({ _id });
    console.log(userFound);
    if (userFound && userFound.username != nowuserFound.username) {
      return res
        .status(400)
        .send(
          "the username has been used already. please change an other username"
        );
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  let user = await User.findOneAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true,
  });
  let token = req.body.token;
  return res.send({
    message: "Profile has been updated successfully!",
    token,
    user,
  });
});

router.post("/follow", async (req, res) => {
  try {
    const { userId, followerId } = req.body;
    console.log(userId, followerId);

    const post = await User.findById(followerId);
    const user = await User.findById(userId);
    console.log(post);
    if (!post) {
      return res.status(404).send("User not found.");
    }
    // if (post.likes.includes(userId)) {
    //   return res.status(400).send("You have already liked the post");
    // }
    const alreadyisFanIndex = post.fansUser.indexOf(userId);
    const alreadyFollowIndex = user.followersUser.indexOf(userId);
    console.log(alreadyisFanIndex);
    if (alreadyisFanIndex !== -1) {
      // If user has already liked, remove the like
      post.fansUser.splice(alreadyisFanIndex, 1);
      user.followersUser.splice(alreadyFollowIndex, 1);
      post.fans -= 1;
      user.followers -= 1;
      await post.save();
      await user.save();
      return res
        .status(200)
        .send({ msg: "User cancel followed successfully.", post });
    }
    post.fansUser.push(userId);
    user.followersUser.push(userId);
    post.fans += 1;
    user.followers += 1;
    await post.save();
    await user.save();

    return res.status(200).send({ msg: "User followed successfully!", post });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});
module.exports = router;
