const mongoose = require("mongoose");
const { Schema } = mongoose;

const likesSchema = new Schema({
  id: {
    type: String,
  },
});

module.exports = mongoose.model("LikeUser", likesSchema);
