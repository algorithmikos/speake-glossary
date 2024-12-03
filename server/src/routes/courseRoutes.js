// wordRoutes.js
const express = require('express');
const courseRouter = express.Router();
const CourseModel = require('../models/Courses');

// FETCHING ALL WORDS
courseRouter.get("/", async (req, res)=>{
  const levels = await CourseModel.find();
  res.json(levels);
});

module.exports = courseRouter;
