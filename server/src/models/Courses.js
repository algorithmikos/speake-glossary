const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  level: {
    type: String,
  },
  description: {
    type: String,
  },
});

const CourseModel = mongoose.model("courses", CourseSchema);

module.exports = CourseModel;