// routes/skillsSearch.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Assuming you have a User model

// Route to search for users by skill
router.get('/skills', async (req, res) => {
    const { skill } = req.query;  // Get the skill query parameter
    if (!skill) {
        return res.status(400).json({ message: "Skill query is required" });
    }
    try {
        // Find users with the skill
        const users = await User.find({
            skills: { $regex: new RegExp(`^${skill}$`, 'i') }
          });  // MongoDB query to search for users who have the skill
        console.log(users.length);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found with this skill" });
    }

    res.json(users);  // Return the users as a response
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
