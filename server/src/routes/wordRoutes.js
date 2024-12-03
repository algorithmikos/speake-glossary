// wordRoutes.js
const express = require('express');
const wordRouter = express.Router();
const WordModel = require('../models/Words');
const UserModel = require('../models/Users');

// FETCHING ALL WORDS
wordRouter.get("/all", async (req, res)=>{
  const words = await WordModel.find();
  res.json(words);
});

// ADDING NEW WORD
wordRouter.post("/newWord", async (req, res)=>{
  const { word } = req.body;
  // Check if a word already exists
  const existingWord = await WordModel.findOne({word});
  if (existingWord) {
    return res.status(400).json({ message: 'Word already exists' });
  }

  const newWord = new WordModel(req.body);
  await newWord.save();

  res.json(req.body);
});

// Add a word to a user
wordRouter.post('/add-word', async (req, res) => {
  try {
    const { wordId, userId } = req.body; // Expect the word _id to be sent in the request body

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Find the user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Initialize the user.words array if it's not already defined
    if (!user.words) {
      user.words = [];
    }

    // Link the word _id to the user's words array
    user.words.push(wordId);

    // Save changes to the user collection
    await user.save();

    res.status(201).json({ message: 'Word added successfully.' });
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Remove a word from a user
wordRouter.delete('/remove-word/:userId/:wordId', async (req, res) => {
  try {
    const { userId, wordId } = req.params;

    // Find the user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the word in the user's words array
    const wordIndex = user.words.findIndex(word => word.toString() === wordId);

    if (wordIndex === -1) {
      return res.status(404).json({ message: 'Word not found for the user.' });
    }

    // Remove the word reference from the user's words array
    user.words.splice(wordIndex, 1);

    // Remove the word document
    await Word.findByIdAndDelete(wordId);

    // Save changes to the user collection
    await user.save();

    res.status(200).json({ message: 'Word removed successfully.' });
  } catch (error) {
    console.error('Error removing word:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add Word(s) to User(s)
wordRouter.post('/add-words-to-users', async (req, res) => {
  try {
    const { wordIds, userIds } = req.body;

    // Find the users and words
    const users = await UserModel.find({ _id: { $in: userIds } });
    const words = await WordModel.find({ _id: { $in: wordIds } });

    // Update users with the new words
    users.forEach(user => {
      // Filter out words that are already present in the user's list
      const newWords = words.filter(word => !user.words.includes(word._id));

      if (newWords.length) {
        // Add only the non-duplicate words to the user's list
        user.words.push(...newWords);
        user.save();
        res.status(201).json({ message: 'Words added to users successfully.' });
      } else {
        res.status(422).json({ message: 'Chosen words are already in glossaries of selected students' });
      }
    });
  } catch (error) {
    console.error('Error adding words to users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Fetch words associated with a user
wordRouter.get('/user-words/', async (req, res) => {
  try {
    const { userId } = req.query;

    // Find the user by directly using the userId string
    const user = await UserModel.findById(userId).populate('words');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract the words array from the user and send it in the response
    const userWordIds = user.words.map(word => word._id);
    
    // Fetch the words from the Words collection using the word IDs
    const userWords = await WordModel.find({ _id: { $in: userWordIds } });

    res.status(200).json(userWords);
  } catch (error) {
    console.error('Error fetching user words:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = wordRouter;
