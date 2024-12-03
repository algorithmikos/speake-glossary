const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String
  },
  first_name: {
    type: String,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  sudo: {
    type: Boolean,
    default: false,
  },
  words: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "words" // This should match the model name of your WordModel
    }
  ],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
