const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
  },
  arTranslation: {
    type: String,
  },
  enDefinition: {
    type: String,
  },
  example: {
    type: String,
  },
  category: {
    type: String,
  },
  level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses"
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const WordModel = mongoose.model("words", WordSchema);

module.exports = WordModel;