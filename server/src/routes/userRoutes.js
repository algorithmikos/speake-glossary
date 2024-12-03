// userRoutes.js
const express = require('express');
const userRouter = express.Router();
const UserModel = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

userRouter.get("/all", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

userRouter.post("/createUser", async (req, res) => {
  try {
    const { username, password, first_name, middle_name, last_name, sudo } = req.body;

    // Check if a user with the same username already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'ID already exists' });
    }

    hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      first_name,
      middle_name,
      last_name,
      sudo,
    });
    
    if (newUser.sudo) {
      newUser.words = undefined;
    }
    
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    !user && res.status(404).json({ error: 'User or password is incorrect' });
    
    const isPasswordValid = bcrypt.compare(password, user.password);
    !isPasswordValid && res.status(404).json({ error: 'User or password is incorrect' });

    const token = jwt.sign({ id: user._id }, 'theFirstApp');
    return res.json({ token, userID: user._id, userNAME: user.first_name, sudo: user.sudo });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

userRouter.delete("/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    // Use Mongoose's `findByIdAndDelete` method to delete a user by _id.
    const deletedUser = await UserModel.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(503).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Handle or rethrow the error as needed.
  }
});

module.exports = userRouter;
