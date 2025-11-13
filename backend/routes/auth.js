const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const generateToken = require('../utils/generateToken')

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = generateToken(user._id);
          // Return token and user ID
        console.log(token)
        res.json({
        token: `Bearer ${token}`,  // Return token in 'Bearer' format
        id: user._id,
        });
        // res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
        try {
          const { email, password } = req.body;
          
          // Find the user by email
          const user = await User.findOne({ email });
          if (!user) return res.status(404).json({ error: 'User not found' });
      
          // Compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
      
          // Generate JWT token with an expiration time (e.g., 1 hour)
        //   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          const token = generateToken(user._id);
      
          // Return token and user ID
          res.json({
            token: `Bearer ${token}`,  // Return token in 'Bearer' format
            id: user._id,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
        }
      });

module.exports = router;
