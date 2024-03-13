const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
    maxlength: 5000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  followersUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LikeUser",
    },
  ],
  followers: {
    type: Number,
    default: 0,
  },
  fansUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LikeUser",
    },
  ],
  fans: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
