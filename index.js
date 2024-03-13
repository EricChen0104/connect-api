const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const OtherAuthRoute = require("./routes").otherAuth;
const postRoute = require("./routes").post;
const postRouteUnRegister = require("./routes").postUnresgister;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect("mongodb://localhost:27017/socialMediaConnect")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
app.use("/api/other", OtherAuthRoute);

app.use(
  "/api/posts",
  passport.authenticate("jwt", { session: false }),
  postRoute
);

app.use("/api/unregister", postRouteUnRegister);

app.listen(10000, () => {
  console.log(
    "backend sever is listening on port https://connect-api-p3po.onrender.com..."
  );
});
